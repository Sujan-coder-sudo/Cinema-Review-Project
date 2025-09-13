import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { genres } from '@/lib/mockData';

interface FilterSidebarProps {
  yearRange: string;
  setYearRange: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  yearRange,
  setYearRange,
  sortBy,
  setSortBy,
  isOpen = true,
  onClose,
  className = ""
}) => {
  const { state, dispatch } = useApp();

  const clearFilters = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_SELECTED_GENRES', payload: [] });
    setYearRange('all');
    setSortBy('rating');
  };

  const activeFiltersCount = state.selectedGenres.length + 
    (yearRange !== 'all' ? 1 : 0) + 
    (state.searchQuery ? 1 : 0);

  const sidebarContent = (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-cinema-gold" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge className="bg-cinema-gold text-cinema-darker">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-cinema-gold hover:text-cinema-gold/80 text-xs"
            >
              Clear All
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-cinema-purple/20" />

      {/* Sort */}
      <Card className="p-4 bg-secondary/30">
        <h4 className="font-medium mb-3 text-foreground">Sort By</h4>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="year">Newest First</SelectItem>
            <SelectItem value="title">A-Z</SelectItem>
            <SelectItem value="duration">Longest First</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Genres */}
      <Card className="p-4 bg-secondary/30">
        <h4 className="font-medium mb-3 text-foreground">Genres</h4>
        <div className="space-y-3">
          {/* Popular genres first */}
          <div>
            <h5 className="text-sm text-muted-foreground mb-2">Popular</h5>
            <div className="flex flex-wrap gap-2">
              {['Action', 'Comedy', 'Drama', 'Thriller'].map((genre) => (
                <Badge
                  key={genre}
                  variant={state.selectedGenres.includes(genre) ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    state.selectedGenres.includes(genre)
                      ? "bg-cinema-gold text-cinema-darker shadow-glow"
                      : "border-cinema-purple/30 hover:border-cinema-gold hover:text-cinema-gold"
                  }`}
                  onClick={() => dispatch({ type: 'TOGGLE_GENRE', payload: genre })}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* All genres */}
          <div>
            <h5 className="text-sm text-muted-foreground mb-2">All Genres</h5>
            <div className="flex flex-wrap gap-2">
              {genres.filter(g => !['Action', 'Comedy', 'Drama', 'Thriller'].includes(g)).map((genre) => (
                <Badge
                  key={genre}
                  variant={state.selectedGenres.includes(genre) ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    state.selectedGenres.includes(genre)
                      ? "bg-cinema-gold text-cinema-darker shadow-glow"
                      : "border-cinema-purple/30 hover:border-cinema-gold hover:text-cinema-gold"
                  }`}
                  onClick={() => dispatch({ type: 'TOGGLE_GENRE', payload: genre })}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Year Range */}
      <Card className="p-4 bg-secondary/30">
        <h4 className="font-medium mb-3 text-foreground">Release Year</h4>
        <Select value={yearRange} onValueChange={setYearRange}>
          <SelectTrigger>
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="recent">Recent (2021+)</SelectItem>
            <SelectItem value="2010s">2010s</SelectItem>
            <SelectItem value="2000s">2000s</SelectItem>
            <SelectItem value="classic">Classic (Pre-2000)</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Trending Tags */}
      <Card className="p-4 bg-secondary/30">
        <h4 className="font-medium mb-3 text-foreground">Trending Tags</h4>
        <div className="flex flex-wrap gap-2">
          {['Marvel', 'DC', 'Disney', 'Netflix Original', 'Award Winner'].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer border-cinema-gold/50 text-cinema-gold hover:bg-cinema-gold/20 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="p-4 bg-gradient-to-r from-cinema-purple/20 to-cinema-blue/20">
        <h4 className="font-medium mb-3 text-foreground">Quick Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Movies:</span>
            <span className="text-cinema-gold font-medium">{state.movies.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Reviews:</span>
            <span className="text-cinema-gold font-medium">{state.reviews.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Genres:</span>
            <span className="text-cinema-gold font-medium">{genres.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );

  return sidebarContent;
};

export default FilterSidebar;