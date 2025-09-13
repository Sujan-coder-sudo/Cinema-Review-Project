import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { Movie } from '@/lib/mockData';
import { useApp, useAuth } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'large';
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  variant = 'default',
  className 
}) => {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  
  const isInWatchlist = user?.watchlist.includes(movie.id) || false;
  
  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (isInWatchlist) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movie.id });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: movie.id });
    }
  };

  return (
    <Link to={`/movies/${movie.id}`}>
      <Card className={cn(
        "movie-card overflow-hidden group cursor-pointer card-gradient",
        variant === 'large' && "md:flex md:max-w-2xl",
        className
      )}>
        <div className={cn(
          "relative overflow-hidden",
          variant === 'large' ? "md:w-1/3" : "aspect-[2/3]"
        )}>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                size="sm"
                className="w-full bg-cinema-gold/90 hover:bg-cinema-gold text-cinema-darker font-semibold"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Trailer
              </Button>
            </div>
          </div>

          {/* Watchlist button */}
          {user && (
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200",
                isInWatchlist && "opacity-100"
              )}
              onClick={toggleWatchlist}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isInWatchlist ? "fill-red-500 text-red-500" : "text-white"
                )} 
              />
            </Button>
          )}
        </div>

        <div className={cn(
          "p-4",
          variant === 'large' && "md:w-2/3 md:flex md:flex-col md:justify-between"
        )}>
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-cinema-gold transition-colors line-clamp-2">
                {movie.title}
              </h3>
            </div>

            <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{movie.duration}m</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.slice(0, 2).map((genre) => (
                <Badge 
                  key={genre} 
                  variant="secondary"
                  className="text-xs bg-cinema-purple/20 text-cinema-purple-light border-cinema-purple/30"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {variant === 'large' && (
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {movie.synopsis}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <StarRating rating={movie.avgRating} size="sm" />
            <div className="text-sm text-muted-foreground">
              {movie.director}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MovieCard;