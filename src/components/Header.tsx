import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Film, Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp, useAuth } from '@/contexts/AppContext';

const Header = () => {
  const { state, dispatch } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-cinema border-b border-cinema-purple/20 shadow-lg shadow-cinema-purple/10">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <Film className="h-10 w-10 text-cinema-gold transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-lg" />
              <div className="absolute inset-0 h-10 w-10 bg-cinema-gold/20 rounded-full blur-md scale-0 group-hover:scale-110 transition-transform duration-300"></div>
            </div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cinema-gold via-cinema-gold to-cinema-silver bg-clip-text text-transparent tracking-tight">
              CinemaReview
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="relative text-foreground/90 hover:text-cinema-gold transition-all duration-300 font-medium text-lg group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cinema-gold to-cinema-silver group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/movies" 
              className="relative text-foreground/90 hover:text-cinema-gold transition-all duration-300 font-medium text-lg group"
            >
              Movies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cinema-gold to-cinema-silver group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-cinema-gold transition-colors duration-300" />
              <Input
                placeholder="Search movies, actors, directors..."
                value={state.searchQuery}
                onChange={handleSearch}
                className="pl-12 pr-4 py-3 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold focus:ring-2 focus:ring-cinema-gold/20 rounded-xl text-lg placeholder:text-muted-foreground/60 transition-all duration-300 hover:bg-secondary/70"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:ring-2 hover:ring-cinema-gold/30 transition-all duration-300">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={user.profilePic} alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-br from-cinema-purple to-cinema-purple-light text-white font-semibold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur border-cinema-purple/30 shadow-xl shadow-cinema-purple/20 mt-2" align="end">
                  <div className="flex flex-col space-y-2 p-4 border-b border-cinema-purple/20">
                    <p className="text-base font-semibold text-foreground">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center px-4 py-3 hover:bg-cinema-purple/10 transition-colors">
                      <User className="mr-3 h-5 w-5 text-cinema-gold" />
                      <span className="text-base">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist" className="cursor-pointer flex items-center px-4 py-3 hover:bg-cinema-purple/10 transition-colors">
                      <Heart className="mr-3 h-5 w-5 text-cinema-gold" />
                      <span className="text-base">Watchlist</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="px-4 py-3 hover:bg-destructive/10 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors">
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="text-base">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="text-base font-medium hover:text-cinema-gold transition-colors">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="btn-gold text-base font-medium px-6 py-2.5 shadow-lg hover:shadow-cinema-gold/20 transition-all duration-300" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 hover:bg-cinema-purple/20 transition-colors">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4 px-1">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-cinema-gold transition-colors duration-300" />
            <Input
              placeholder="Search movies..."
              value={state.searchQuery}
              onChange={handleSearch}
              className="pl-12 pr-4 py-3 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold focus:ring-2 focus:ring-cinema-gold/20 rounded-xl text-base"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;