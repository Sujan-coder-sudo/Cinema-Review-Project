import React from 'react';
import { Loader2, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'cinema' | 'minimal';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
  variant = 'default',
}) => {
  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    className
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {variant === 'cinema' ? (
        <div className="relative">
          <Film className={spinnerClasses} />
          <div className="absolute inset-0 animate-pulse">
            <div className="h-full w-full rounded-full bg-cinema-gold/20 blur-sm"></div>
          </div>
        </div>
      ) : variant === 'minimal' ? (
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-cinema-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-cinema-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-cinema-gold rounded-full animate-bounce"></div>
        </div>
      ) : (
        <Loader2 className={spinnerClasses} />
      )}
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Loading overlay for components
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}> = ({ isLoading, children, text, className }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
        <LoadingSpinner text={text} />
      </div>
    </div>
  );
};

// Loading skeleton for different content types
export const LoadingSkeleton: React.FC<{
  type?: 'movie-card' | 'review' | 'profile' | 'text' | 'image';
  className?: string;
}> = ({ type = 'text', className }) => {
  const baseClasses = 'animate-pulse bg-muted rounded';

  const skeletons = {
    'movie-card': (
      <div className={cn('space-y-3', className)}>
        <div className={cn(baseClasses, 'aspect-[2/3] w-full')} />
        <div className="space-y-2">
          <div className={cn(baseClasses, 'h-4 w-3/4')} />
          <div className={cn(baseClasses, 'h-3 w-1/2')} />
        </div>
      </div>
    ),
    review: (
      <div className={cn('space-y-3 p-4', className)}>
        <div className="flex items-center space-x-3">
          <div className={cn(baseClasses, 'h-10 w-10 rounded-full')} />
          <div className="space-y-2">
            <div className={cn(baseClasses, 'h-4 w-24')} />
            <div className={cn(baseClasses, 'h-3 w-16')} />
          </div>
        </div>
        <div className="space-y-2">
          <div className={cn(baseClasses, 'h-4 w-full')} />
          <div className={cn(baseClasses, 'h-4 w-3/4')} />
        </div>
      </div>
    ),
    profile: (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center space-x-4">
          <div className={cn(baseClasses, 'h-16 w-16 rounded-full')} />
          <div className="space-y-2">
            <div className={cn(baseClasses, 'h-6 w-32')} />
            <div className={cn(baseClasses, 'h-4 w-48')} />
          </div>
        </div>
      </div>
    ),
    text: (
      <div className={cn('space-y-2', className)}>
        <div className={cn(baseClasses, 'h-4 w-full')} />
        <div className={cn(baseClasses, 'h-4 w-3/4')} />
        <div className={cn(baseClasses, 'h-4 w-1/2')} />
      </div>
    ),
    image: (
      <div className={cn(baseClasses, 'aspect-video w-full', className)} />
    ),
  };

  return skeletons[type];
};

// Loading grid for multiple items
export const LoadingGrid: React.FC<{
  count?: number;
  type?: 'movie-card' | 'review';
  className?: string;
}> = ({ count = 6, type = 'movie-card', className }) => {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6', className)}>
      {Array.from({ length: count }, (_, i) => (
        <LoadingSkeleton key={i} type={type} />
      ))}
    </div>
  );
};

export default LoadingSpinner;
