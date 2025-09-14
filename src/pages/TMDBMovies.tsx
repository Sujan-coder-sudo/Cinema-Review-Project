import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Removed Sheet components as mobile filter button was removed
import { useToast } from '@/hooks/use-toast';
import TMDBMovieCard, { TMDBMovieGridSkeleton } from '@/components/TMDBMovieCard';
import { useMovieGenres, usePaginatedDiscoverMovies } from '@/hooks/useTMDB';

interface FilterState {
  query: string;
  genre: string;
  year: string;
  sortBy: string;
  voteAverage: string;
}

const TMDBMovies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // == Single Source of Truth: Derive all state from URL search params ==
  const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const filtersFromUrl = useMemo(() => ({
    query: searchParams.get('query') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sortBy') || 'popularity.desc',
    voteAverage: searchParams.get('voteAverage') || '',
  }), [searchParams]);

  // Local UI state for controlled inputs like the search bar
  const [searchInput, setSearchInput] = useState(filtersFromUrl.query);

  // Genres
  const { data: genresData } = useMovieGenres();
  const genres = genresData?.genres || [];

  // == Handlers: These functions only modify the URL search params ==
  const handleGoTo = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset page when any filter changes
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    // Preserve sortBy unless you want it to reset too
    params.set('sortBy', searchParams.get('sortBy') || 'popularity.desc');
    setSearchParams(params, { replace: true });
    setSearchInput('');
  };

  // Debounce search input to avoid excessive updates
  useEffect(() => {
    const handler = setTimeout(() => {
      updateFilter('query', searchInput);
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // == Data Fetching: The hook is called with params derived from the URL ==
  const apiParams = useMemo(() => ({
    genre: filtersFromUrl.genre ? parseInt(filtersFromUrl.genre, 10) : undefined,
    year: filtersFromUrl.year ? parseInt(filtersFromUrl.year, 10) : undefined,
    sortBy: filtersFromUrl.sortBy,
    voteAverage: filtersFromUrl.voteAverage ? parseFloat(filtersFromUrl.voteAverage) : undefined,
    query: filtersFromUrl.query || undefined,
  }), [filtersFromUrl]);

  const {
    movies,
    loading,
    error,
    goToPage,
    totalPages,
    currentPage,
    totalResults
  } = usePaginatedDiscoverMovies(apiParams);

  // This is the primary effect that syncs the URL state to the data fetching hook
  useEffect(() => {
    goToPage(currentPageFromUrl);
  }, [currentPageFromUrl, apiParams, goToPage]);

  // Error toast
  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: 'Failed to load movies. Try again later.', variant: 'destructive' });
    }
  }, [error, toast]);

  // == UI Helpers ==
  const paginationPages = useMemo(() => {
    const pages: number[] = [];
    const maxToShow = 7;
    if (!totalPages || totalPages <= 1) return [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxToShow - 1);
    start = Math.max(1, Math.min(start, end - maxToShow + 1));
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  // UI helpers
  const activeFiltersCount = [
    filtersFromUrl.query,
    filtersFromUrl.genre,
    filtersFromUrl.year,
    filtersFromUrl.sortBy !== 'popularity.desc' ? filtersFromUrl.sortBy : '',
    filtersFromUrl.voteAverage
  ].filter(Boolean).length;

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

  return (
    <div className="min-h-screen pt-8 pb-16 bg-surface-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Movies</h1>
          <p className="text-muted-foreground text-lg">Explore our vast collection of movies from around the world</p>
        </div>

        {/* TWO COLUMN LAYOUT: LEFT FILTERS, RIGHT MOVIES (from small screens up) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          {/* LEFT: filters (sticky across breakpoints) */}
          <aside className="sm:col-span-4 lg:col-span-3">
            <Card className="card-gradient p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {/* Using Filter icon here for title */}
                  <Filter className="h-5 w-5 text-cinema-gold" />
                  Filters
                </h2>
                {activeFiltersCount > 0 ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>Clear</Button>
                ) : <div style={{ width: 48 }} />}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search Movies</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      aria-label="Search movies"
                      placeholder="Search by title..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <Select value={filtersFromUrl.genre || 'all'} onValueChange={(v) => updateFilter('genre', v === 'all' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder="All Genres" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium mb-2">Release Year</label>
                  <Select value={filtersFromUrl.year || 'any'} onValueChange={(v) => updateFilter('year', v === 'any' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder="Any Year" /></SelectTrigger>
                    <SelectContent style={{ maxHeight: 320, overflow: 'auto' }}>
                      <SelectItem value="any">Any Year</SelectItem>
                      {yearOptions.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <Select value={filtersFromUrl.voteAverage || 'any'} onValueChange={(v) => updateFilter('voteAverage', v === 'any' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder="Any Rating" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="8">8+ Stars</SelectItem>
                      <SelectItem value="7">7+ Stars</SelectItem>
                      <SelectItem value="6">6+ Stars</SelectItem>
                      <SelectItem value="5">5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* active badges */}
                {activeFiltersCount > 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Active Filters</label>
                      <div className="flex flex-wrap gap-2">
                        {filtersFromUrl.query && <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">Search: {filtersFromUrl.query}</Badge>}
                        {filtersFromUrl.genre && <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">{genres.find(g => g.id.toString() === filtersFromUrl.genre)?.name}</Badge>}
                        {filtersFromUrl.year && <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">{filtersFromUrl.year}</Badge>}
                        {filtersFromUrl.voteAverage && <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">{filtersFromUrl.voteAverage}+ Stars</Badge>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </aside>

          {/* RIGHT: movies area */}
          <main className="sm:col-span-8 lg:col-span-9">
            {/* top controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Results</h2>
                <p className="text-muted-foreground">{loading && movies.length === 0 ? 'Loading...' : `${totalResults?.toLocaleString() || 0} movies found`}</p>
              </div>

              <div className="flex items-center gap-3">
                <Select value={filtersFromUrl.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Sort by..." /></SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')} aria-label="Grid view"><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} aria-label="List view"><List className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {/* movie grid/list or skeleton */}
            {loading && movies.length === 0 ? (
              <TMDBMovieGridSkeleton count={12} variant={viewMode === 'list' ? 'large' : 'default'} />
            ) : movies && movies.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'grid grid-cols-1 gap-6'}>
                  {movies.map(movie => (
                    <Link key={movie.id} to={`/movies/${movie.id}`} className="group">
                      <TMDBMovieCard movie={movie} variant={viewMode === 'list' ? 'large' : 'default'} />
                    </Link>
                  ))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoTo(1)}
                      disabled={currentPage <= 1}
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoTo(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Prev
                    </Button>

                    {/* Leading ellipsis */}
                    {paginationPages.length > 0 && paginationPages[0] > 1 && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleGoTo(1)}>1</Button>
                        {paginationPages[0] > 2 && <span className="px-1 text-muted-foreground">…</span>}
                      </>
                    )}

                    {paginationPages.map(p => (
                      <Button
                        key={p}
                        variant={p === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleGoTo(p)}
                      >
                        {p}
                      </Button>
                    ))}

                    {/* Trailing ellipsis */}
                    {paginationPages.length > 0 && paginationPages[paginationPages.length - 1] < totalPages && (
                      <>
                        {paginationPages[paginationPages.length - 1] < totalPages - 1 && (
                          <span className="px-1 text-muted-foreground">…</span>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleGoTo(totalPages)}>{totalPages}</Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoTo(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGoTo(totalPages)}
                      disabled={currentPage >= totalPages}
                    >
                      Last
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="card-gradient p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TMDBMovies;
