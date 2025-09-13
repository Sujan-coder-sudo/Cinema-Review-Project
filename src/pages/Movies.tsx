import React, { useState, useMemo } from 'react';
import { Filter, SortAsc, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import MovieCard from '@/components/MovieCard';
import { useApp } from '@/contexts/AppContext';
import { genres } from '@/lib/mockData';

const Movies = () => {
  const { state, dispatch } = useApp();
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [yearRange, setYearRange] = useState('all');

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let filtered = state.movies;

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        movie.cast.some(actor => 
          actor.toLowerCase().includes(state.searchQuery.toLowerCase())
        ) ||
        movie.genre.some(genre =>
          genre.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      );
    }

    // Filter by selected genres
    if (state.selectedGenres.length > 0) {
      filtered = filtered.filter(movie =>
        state.selectedGenres.some(genre => movie.genre.includes(genre))
      );
    }

    // Filter by year range
    if (yearRange !== 'all') {
      const currentYear = new Date().getFullYear();
      switch (yearRange) {
        case 'recent':
          filtered = filtered.filter(movie => movie.year >= currentYear - 3);
          break;
        case '2010s':
          filtered = filtered.filter(movie => movie.year >= 2010 && movie.year < 2020);
          break;
        case '2000s':
          filtered = filtered.filter(movie => movie.year >= 2000 && movie.year < 2010);
          break;
        case 'classic':
          filtered = filtered.filter(movie => movie.year < 2000);
          break;
      }
    }

    // Sort movies
    switch (sortBy) {
      case 'rating':
        return filtered.sort((a, b) => b.avgRating - a.avgRating);
      case 'year':
        return filtered.sort((a, b) => b.year - a.year);
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'duration':
        return filtered.sort((a, b) => b.duration - a.duration);
      default:
        return filtered;
    }
  }, [state.movies, state.searchQuery, state.selectedGenres, sortBy, yearRange]);

  const clearFilters = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_SELECTED_GENRES', payload: [] });
    setYearRange('all');
    setSortBy('rating');
  };

  const activeFiltersCount = state.selectedGenres.length + 
    (yearRange !== 'all' ? 1 : 0) + 
    (state.searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Movies
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of {state.movies.length} movies
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 space-y-6">
            <div className="card-gradient p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-cinema-gold hover:text-cinema-gold/80"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Genres */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={state.selectedGenres.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        state.selectedGenres.includes(genre)
                          ? "bg-cinema-gold text-cinema-darker"
                          : "border-cinema-purple/30 hover:border-cinema-gold"
                      }`}
                      onClick={() => dispatch({ type: 'TOGGLE_GENRE', payload: genre })}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Release Year</h4>
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
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-cinema-gold text-cinema-darker">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Filter movies by genre, year, and more
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Same filter content as desktop */}
                      <div>
                        <h4 className="font-medium mb-3">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                          {genres.map((genre) => (
                            <Badge
                              key={genre}
                              variant={state.selectedGenres.includes(genre) ? "default" : "outline"}
                              className={`cursor-pointer transition-all ${
                                state.selectedGenres.includes(genre)
                                  ? "bg-cinema-gold text-cinema-darker"
                                  : "border-cinema-purple/30 hover:border-cinema-gold"
                              }`}
                              onClick={() => dispatch({ type: 'TOGGLE_GENRE', payload: genre })}
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Release Year</h4>
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
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="year">Newest First</SelectItem>
                    <SelectItem value="title">A-Z</SelectItem>
                    <SelectItem value="duration">Longest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredMovies.length} movies
                </span>
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    variant={viewMode === 'list' ? 'large' : 'default'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">No movies found</div>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;