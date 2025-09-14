import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TMDBMovie, tmdbClient, formatReleaseYear } from '@/lib/tmdb';

interface TMDBMovieCardProps {
  movie: TMDBMovie;
  variant?: 'default' | 'large' | 'compact';
  showGenres?: boolean;
  showRating?: boolean;
  showYear?: boolean;
  className?: string;
}

export const TMDBMovieCard: React.FC<TMDBMovieCardProps> = ({
  movie,
  variant = 'default',
  showGenres = true,
  showRating = true,
  showYear = true,
  className = '',
}) => {
  const posterUrl = tmdbClient.getImageURL(movie.poster_path);
  const releaseYear = formatReleaseYear(movie.release_date);

  const getCardClasses = () => {
    const baseClasses = 'group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl';
    
    switch (variant) {
      case 'large':
        return `${baseClasses} aspect-[2/3]`;
      case 'compact':
        return `${baseClasses} aspect-[3/4]`;
      default:
        return `${baseClasses} aspect-[2/3]`;
    }
  };

  const getImageClasses = () => {
    const baseClasses = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-110';
    return baseClasses;
  };

  const renderOverlay = () => (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Decorative overlay control (not a nested link) */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-md bg-cinema-gold text-cinema-darker shadow-md"
        >
          <Play className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  const renderRating = () => {
    if (!showRating || movie.vote_average === 0) return null;

    return (
      <div className="absolute top-2 right-2 bg-cinema-darker/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
        <Star className="h-3 w-3 text-cinema-gold fill-current" />
        <span className="text-xs font-semibold text-white">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderGenres = () => {
    if (!showGenres || !movie.genre_ids || movie.genre_ids.length === 0) return null;

    // Note: This would need genre mapping from TMDB genres API
    // For now, we'll show a generic badge
    return (
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30">
            Movie
          </Badge>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (variant === 'compact') {
      return (
        <Card className={`${getCardClasses()} ${className}`}>
          <Link to={`/movies/${movie.id}`}>
            <div className="relative">
              <img
                src={posterUrl}
                alt={movie.title}
                className={getImageClasses()}
                loading="lazy"
              />
              {renderRating()}
              {renderGenres()}
              {renderOverlay()}
            </div>
          </Link>
          <CardContent className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-cinema-gold transition-colors">
              {movie.title}
            </h3>
            {showYear && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{releaseYear}</span>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${getCardClasses()} ${className}`}>
        <Link to={`/movies/${movie.id}`}>
          <div className="relative">
            <img
              src={posterUrl}
              alt={movie.title}
              className={getImageClasses()}
              loading="lazy"
            />
            {renderRating()}
            {renderGenres()}
          </div>
        </Link>
        {renderOverlay()}
        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-cinema-gold transition-colors">
            {movie.title}
          </h3>
          
          <div className="space-y-1">
            {showYear && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{releaseYear}</span>
              </div>
            )}
            
            {showRating && movie.vote_average > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-cinema-gold fill-current" />
                  <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>
            )}
          </div>

          {variant === 'large' && movie.overview && (
            <p className="text-sm text-muted-foreground line-clamp-3 mt-3">
              {movie.overview}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return renderContent();
};

// Skeleton component for loading states
export const TMDBMovieCardSkeleton: React.FC<{ variant?: 'default' | 'large' | 'compact' }> = ({
  variant = 'default'
}) => {
  const getCardClasses = () => {
    const baseClasses = 'animate-pulse rounded-lg overflow-hidden';
    
    switch (variant) {
      case 'large':
        return `${baseClasses} aspect-[2/3]`;
      case 'compact':
        return `${baseClasses} aspect-[3/4]`;
      default:
        return `${baseClasses} aspect-[2/3]`;
    }
  };

  return (
    <Card className={getCardClasses()}>
      <div className="w-full h-full bg-muted" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
};

// Grid component for multiple movie cards
export const TMDBMovieGrid: React.FC<{
  movies: TMDBMovie[];
  variant?: 'default' | 'large' | 'compact';
  showGenres?: boolean;
  showRating?: boolean;
  showYear?: boolean;
  className?: string;
}> = ({
  movies,
  variant = 'default',
  showGenres = true,
  showRating = true,
  showYear = true,
  className = '',
}) => {
  const getGridClasses = () => {
    const baseClasses = 'grid gap-6';
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10`;
      case 'large':
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`;
      default:
        return `${baseClasses} grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`;
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {movies.map((movie) => (
        <TMDBMovieCard
          key={movie.id}
          movie={movie}
          variant={variant}
          showGenres={showGenres}
          showRating={showRating}
          showYear={showYear}
        />
      ))}
    </div>
  );
};

// Loading grid component
export const TMDBMovieGridSkeleton: React.FC<{
  count?: number;
  variant?: 'default' | 'large' | 'compact';
}> = ({ count = 12, variant = 'default' }) => {
  const getGridClasses = () => {
    const baseClasses = 'grid gap-6';
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10`;
      case 'large':
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`;
      default:
        return `${baseClasses} grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`;
    }
  };

  return (
    <div className={getGridClasses()}>
      {Array.from({ length: count }, (_, i) => (
        <TMDBMovieCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};

export default TMDBMovieCard;
