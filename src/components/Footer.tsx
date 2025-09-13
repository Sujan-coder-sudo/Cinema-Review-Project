import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-cinema-darker border-t border-cinema-purple/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-cinema-gold" />
              <span className="text-xl font-bold bg-gradient-to-r from-cinema-gold to-cinema-silver bg-clip-text text-transparent">
                CinemaReview
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate destination for discovering, reviewing, and sharing thoughts about movies. 
              Join our community of film enthusiasts.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-cinema-gold">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-cinema-gold">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-cinema-gold">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                Home
              </Link>
              <Link to="/movies" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                Browse Movies
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                My Profile
              </Link>
              <Link to="/watchlist" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                Watchlist
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <nav className="flex flex-col space-y-2">
              <button className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors text-left">
                Action Movies
              </button>
              <button className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors text-left">
                Comedy Movies  
              </button>
              <button className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors text-left">
                Drama Movies
              </button>
              <button className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors text-left">
                Sci-Fi Movies
              </button>
            </nav>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">About</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-cinema-gold transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-cinema-purple/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CinemaReview. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by movie enthusiasts</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Powered by{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cinema-gold hover:text-cinema-gold/80 transition-colors"
            >
              TMDB API
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;