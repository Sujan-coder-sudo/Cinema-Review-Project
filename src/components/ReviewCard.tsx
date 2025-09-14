import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/StarRating';
import { Review, Movie } from '@/lib/mockData';

interface ReviewCardProps {
  review: Review;
  movie?: Movie;
  showMovie?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  movie,
  showMovie = false,
  className = ""
}) => {
  return (
    <Card className={`card-gradient p-4 md:p-6 ${className}`}>
      <div className="flex gap-4 md:gap-6">
        {/* Movie Poster (if showing movie info) */}
        {showMovie && movie && (
          <Link to={`/movies/${movie.id}`} className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 md:w-20 md:h-30 object-cover rounded-lg hover:scale-105 transition-transform"
            />
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              {/* Movie Title (if showing movie info) */}
              {showMovie && movie && (
                <div className="mb-2">
                  <Link 
                    to={`/movies/${movie.id}`}
                    className="text-lg md:text-xl font-bold text-foreground hover:text-cinema-gold transition-colors line-clamp-1"
                  >
                    {movie.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {movie.year} • {movie.director}
                  </div>
                </div>
              )}
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={review.userAvatar} alt={review.username} />
                  <AvatarFallback className="text-xs">
                    {review.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{review.username}</div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </div>
            </div>
            
            {/* Date */}
            <div className="text-xs text-muted-foreground flex-shrink-0">
              {new Date(review.timestamp).toLocaleDateString()}
            </div>
          </div>
          
          {/* Review Text */}
          <p className="text-muted-foreground leading-relaxed mb-3">
            {review.text}
          </p>
          
          {/* Movie Genres (if showing movie info) */}
          {showMovie && movie && (
            <div className="flex flex-wrap gap-2">
              {movie.genre.slice(0, 3).map((genre) => (
                <Badge 
                  key={genre}
                  variant="secondary"
                  className="text-xs"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {!showMovie && <Separator className="mt-4" />}
    </Card>
  );
};

export default ReviewCard;