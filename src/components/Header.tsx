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
    <header className="sticky top-0 z-50 backdrop-cinema border-b border-cinema-purple/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Film className="h-8 w-8 text-cinema-gold transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cinema-gold to-cinema-silver bg-clip-text text-transparent">
              CinemaReview
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-cinema-gold transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-foreground hover:text-cinema-gold transition-colors">
              Movies
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                value={state.searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.profilePic} alt={user.username} />
                      <AvatarFallback className="bg-cinema-purple text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-cinema-purple/30" align="end">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Watchlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="btn-gold" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              value={state.searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;