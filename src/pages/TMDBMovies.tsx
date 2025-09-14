import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SlidersHorizontal, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import TMDBMovieCard, { TMDBMovieGrid, TMDBMovieGridSkeleton } from '@/components/TMDBMovieCard';
import { useDiscoverMovies, useMovieGenres, usePaginatedDiscoverMovies } from '@/hooks/useTMDB';

interface FilterState {
  query: string;
  genre: string;
  year: string;
  sortBy: string;
  voteAverage: string;
  page: number;
}

const TMDBMovies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get('query') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sortBy') || 'popularity.desc',
    voteAverage: searchParams.get('voteAverage') || '',
    page: 1,
  });

  // Fetch genres
  const { data: genresData } = useMovieGenres();
  const genres = genresData?.genres || [];

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.query);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.query) {
        setFilters(prev => ({ ...prev, query: searchInput, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, filters.query]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.year) params.set('year', filters.year);
    if (filters.sortBy !== 'popularity.desc') params.set('sortBy', filters.sortBy);
    if (filters.voteAverage) params.set('voteAverage', filters.voteAverage);
    if (filters.page > 1) params.set('page', filters.page.toString());
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Prepare API params
  const apiParams = useMemo(() => ({
    page: filters.page,
    genre: filters.genre ? parseInt(filters.genre) : undefined,
    year: filters.year ? parseInt(filters.year) : undefined,
    sortBy: filters.sortBy,
    voteAverage: filters.voteAverage ? parseFloat(filters.voteAverage) : undefined,
  }), [filters]);

  // Fetch movies with filters
  const { 
    movies, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh, 
    totalPages, 
    currentPage,
    totalResults 
  } = usePaginatedDiscoverMovies(apiParams);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genre: '',
      year: '',
      sortBy: 'popularity.desc',
      voteAverage: '',
      page: 1,
    });
    setSearchInput('');
  };

  // Get active filters count
  const activeFiltersCount = [
    filters.query,
    filters.genre,
    filters.year,
    filters.sortBy !== 'popularity.desc' ? filters.sortBy : '',
    filters.voteAverage,
  ].filter(Boolean).length;

  // Generate year options (current year back to 1920)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'vote_count.desc', label: 'Most Voted' },
    { value: 'revenue.desc', label: 'Highest Revenue' },
  ];

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load movies. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Movies</h1>
          <p className="text-muted-foreground text-lg">
            Explore our vast collection of movies from around the world
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="xl:w-80 flex-shrink-0">
            <Card className="card-gradient p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-cinema-gold" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search Movies</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <Select value={filters.genre || "all"} onValueChange={(value) => handleFilterChange('genre', value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id.toString()}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Release Year</label>
                  <Select value={filters.year || "any"} onValueChange={(value) => handleFilterChange('year', value === "any" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Year</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <Select value={filters.voteAverage || "any"} onValueChange={(value) => handleFilterChange('voteAverage', value === "any" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="8">8+ Stars</SelectItem>
                      <SelectItem value="7">7+ Stars</SelectItem>
                      <SelectItem value="6">6+ Stars</SelectItem>
                      <SelectItem value="5">5+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Active Filters</label>
                    <div className="flex flex-wrap gap-2">
                      {filters.query && (
                        <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">
                          Search: {filters.query}
                        </Badge>
                      )}
                      {filters.genre && (
                        <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">
                          {genres.find(g => g.id.toString() === filters.genre)?.name}
                        </Badge>
                      )}
                      {filters.year && (
                        <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">
                          {filters.year}
                        </Badge>
                      )}
                      {filters.voteAverage && (
                        <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">
                          {filters.voteAverage}+ Stars
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Results Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Discover Movies</h2>
                <p className="text-muted-foreground">
                  {loading ? 'Loading...' : `${totalResults.toLocaleString()} movies found`}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="xl:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile filter content would go here - same as sidebar */}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Movies Grid */}
            {loading && currentPage === 1 ? (
              <TMDBMovieGridSkeleton 
                count={12} 
                variant={viewMode === 'list' ? 'large' : 'default'} 
              />
            ) : movies.length > 0 ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {movies.length} of {totalResults.toLocaleString()} movies
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">View:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <TMDBMovieGrid 
                  movies={movies} 
                  variant={viewMode === 'list' ? 'large' : 'default'}
                  className="mb-8"
                />

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center py-8">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      variant="outline"
                      size="lg"
                      className="btn-outline min-w-48"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-cinema-gold border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        'Load More Movies'
                      )}
                    </Button>
                  </div>
                )}

                {/* Pagination Info */}
                <div className="text-center mt-8 text-muted-foreground border-t pt-6">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span>Page {currentPage} of {totalPages}</span>
                    <span>•</span>
                    <span>{totalResults.toLocaleString()} total movies</span>
                    {activeFiltersCount > 0 && (
                      <>
                        <span>•</span>
                        <span>{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied</span>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Card className="card-gradient p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find more movies.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TMDBMovies;
