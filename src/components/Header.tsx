import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Film, Heart, Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp, useAuth } from "@/contexts/AppContext";
import { tmdbClient } from '../lib/tmdb';
import { Movie, Person } from '../types/tmdb';

const Header = () => {
  const { dispatch } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<Movie | Person>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await tmdbClient.searchMulti(searchQuery);
      setSearchResults(results.slice(0, 5)); // Show top 5 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: Movie | Person) => {
    if ('title' in result) {
      // It's a movie
      navigate(`/movies/${result.id}`);
    } else {
      // It's a person
      navigate(`/person/${result.id}`);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  return (
    <header className="sticky top-0 z-50 bg-background/60 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b border-cinema-purple/20 shadow-md shadow-cinema-purple/10">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link
            to="/"
            className="flex items-center space-x-3 flex-shrink-0 group"
          >
            <div className="relative">
              <Film className="h-10 w-10 text-cinema-gold transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-lg" />
              <div className="absolute inset-0 h-10 w-10 bg-cinema-gold/20 rounded-full blur-md scale-0 group-hover:scale-110 transition-transform duration-300"></div>
            </div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cinema-gold via-cinema-gold to-cinema-silver bg-clip-text text-transparent tracking-tight">
              CinemaReview
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 hover:bg-cinema-purple/20 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Middle: Search + Nav (desktop only) */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-4xl">
          {/* Search */}
          <div className="hidden md:flex-1 md:flex md:justify-center px-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for movies, TV shows, people..."
                  className="w-full bg-gray-800 text-white px-4 py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={inputRef}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
                )}
                {searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={`${'title' in result ? 'movie' : 'person'}-${result.id}`}
                        className="p-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                        onClick={() => handleResultClick(result)}
                      >
                        {'poster_path' in result ? (
                          <img
                            src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : '/placeholder-movie.png'}
                            alt={result.title}
                            className="w-10 h-15 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-15 bg-gray-700 rounded flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">
                            {'title' in result ? result.title : result.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {result.media_type === 'movie' 
                              ? 'Movie' 
                              : result.media_type === 'tv' 
                                ? 'TV Show' 
                                : 'Person'}
                            {result.media_type === 'person' ? '' : 
                              (('release_date' in result && result.release_date) || ('first_air_date' in result && result.first_air_date)) 
                                ? ` • ${(result.release_date || result.first_air_date)?.split('-')[0]}` 
                                : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="header-link">Home</Link>
            <Link to="/movies" className="header-link">Movies</Link>
          </nav>
        </div>

        {/* Right: User Menu */}
        <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full hover:ring-2 hover:ring-cinema-gold/30 transition-all duration-300"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.profilePic} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-cinema-purple to-cinema-purple-light text-white font-semibold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-card/95 backdrop-blur border-cinema-purple/30 shadow-xl shadow-cinema-purple/20 mt-2"
                align="end"
              >
                <div className="flex flex-col space-y-2 p-4 border-b border-cinema-purple/20">
                  <p className="text-base font-semibold text-foreground">
                    {user.username}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="cursor-pointer flex items-center px-4 py-3 hover:bg-cinema-purple/10 transition-colors"
                  >
                    <User className="mr-3 h-5 w-5 text-cinema-gold" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/watchlist"
                    className="cursor-pointer flex items-center px-4 py-3 hover:bg-cinema-purple/10 transition-colors"
                  >
                    <Heart className="mr-3 h-5 w-5 text-cinema-gold" /> Watchlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-base font-medium hover:text-cinema-gold transition-colors"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button className="btn-gold text-base font-medium px-6 py-2.5 shadow-lg hover:shadow-cinema-gold/20 transition-all duration-300" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search - Hidden by default, shown when menu is open */}
      <div className={`md:hidden px-4 py-3 bg-gray-900 ${!mobileMenuOpen && 'hidden'}`}>
        <form onSubmit={handleSearch} className="relative">
          <input
            id="mobile-search-input"
            type="text"
            placeholder="Search for movies, TV shows, people..."
            className="w-full bg-gray-800 text-white px-4 py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-cinema-gold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin" />
          )}
        </form>
        {searchResults.length > 0 && (
          <div className="mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-96 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={`${'title' in result ? 'movie' : 'person'}-${result.id}`}
                className="p-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                onClick={() => handleResultClick(result)}
              >
                {'poster_path' in result ? (
                  <img
                    src={result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : '/placeholder-movie.png'}
                    alt={result.title}
                    className="w-10 h-15 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-15 bg-gray-700 rounded flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">
                    {'title' in result ? result.title : result.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {result.media_type === 'movie' 
                      ? 'Movie' 
                      : result.media_type === 'tv' 
                        ? 'TV Show' 
                        : 'Person'}
                    {result.media_type !== 'person' && 
                      'release_date' in result && 
                      result.release_date && 
                      ` • ${result.release_date.split('-')[0]}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-cinema-purple/20 shadow-md">
          <nav className="flex flex-col p-4 space-y-3">
            <Link to="/" className="header-link">Home</Link>
            <Link to="/movies" className="header-link">Movies</Link>
            <Link to="/demo" className="header-link">Demo</Link>
            {user ? (
              <>
                <Link to="/profile" className="header-link">Profile</Link>
                <Link to="/watchlist" className="header-link">Watchlist</Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 text-left px-2 py-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-link">Login</Link>
                <Link to="/register" className="header-link">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
