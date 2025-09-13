import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1;
        const isActive = value <= (hoverRating || rating);
        
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-all duration-200 star-rating",
              isActive 
                ? "fill-cinema-gold text-cinema-gold" 
                : "fill-transparent text-cinema-silver/50",
              interactive && "cursor-pointer hover:scale-110"
            )}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      
      {/* Rating text */}
      <span className="text-sm text-muted-foreground ml-2">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;