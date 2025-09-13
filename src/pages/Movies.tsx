import React, { useState, useMemo } from 'react';
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import MovieCard from '@/components/MovieCard';
import FilterSidebar from '@/components/FilterSidebar';
import { useApp } from '@/contexts/AppContext';

const Movies = () => {
  const { state } = useApp();
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [yearRange, setYearRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const moviesPerPage = 12;

  // Filter and sort movies
  const { filteredMovies, totalPages, paginatedMovies } = useMemo(() => {
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
        filtered = filtered.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'year':
        filtered = filtered.sort((a, b) => b.year - a.year);
        break;
      case 'title':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        filtered = filtered.sort((a, b) => b.duration - a.duration);
        break;
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / moviesPerPage);
    const startIndex = (currentPage - 1) * moviesPerPage;
    const paginatedMovies = filtered.slice(startIndex, startIndex + moviesPerPage);

    return {
      filteredMovies: filtered,
      totalPages,
      paginatedMovies
    };
  }, [state.movies, state.searchQuery, state.selectedGenres, sortBy, yearRange, currentPage, moviesPerPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [state.searchQuery, state.selectedGenres, yearRange, sortBy]);


  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 min-h-screen bg-secondary/20 border-r border-cinema-purple/20">
          <div className="sticky top-20 p-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <FilterSidebar
              yearRange={yearRange}
              setYearRange={setYearRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Discover Movies
              </h1>
              <p className="text-muted-foreground">
                Explore our collection of {state.movies.length} movies
              </p>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Movies</SheetTitle>
                      <SheetDescription>
                        Refine your movie search with filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        yearRange={yearRange}
                        setYearRange={setYearRange}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        onClose={() => setShowMobileFilters(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center text-sm text-muted-foreground">
                  Showing {paginatedMovies.length} of {filteredMovies.length} movies
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  View:
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
            {paginatedMovies.length > 0 ? (
              <>
                <div className={`grid gap-6 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedMovies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      variant={viewMode === 'list' ? 'large' : 'default'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="justify-center">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">No movies found</div>
                <Button onClick={() => {
                  setYearRange('all');
                  setSortBy('rating');
                }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Movies;