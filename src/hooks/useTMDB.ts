// Custom hooks for TMDB API calls with loading states and error handling

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  tmdbClient, 
  TMDBMovie, 
  TMDBMovieDetails, 
  TMDBGenre, 
  TMDBResponse,
  TMDBMovieCredits,
  TMDBMovieReviews 
} from '@/lib/tmdb';

// Generic hook for TMDB API calls
export function useTMDB<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    onError?: (error: any) => void;
    onSuccess?: (data: T) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { immediate = true, onError, onSuccess } = options;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

// Hook for popular movies
export function usePopularMovies(page: number = 1) {
  return useTMDB(
    () => tmdbClient.getPopularMovies(page),
    [page]
  );
}

// Hook for top rated movies
export function useTopRatedMovies(page: number = 1) {
  return useTMDB(
    () => tmdbClient.getTopRatedMovies(page),
    [page]
  );
}

// Hook for trending movies
export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1) {
  return useTMDB(
    () => tmdbClient.getTrendingMovies(timeWindow, page),
    [timeWindow, page]
  );
}

// Hook for now playing movies
export function useNowPlayingMovies(page: number = 1) {
  return useTMDB(
    () => tmdbClient.getNowPlayingMovies(page),
    [page]
  );
}

// Hook for upcoming movies
export function useUpcomingMovies(page: number = 1) {
  return useTMDB(
    () => tmdbClient.getUpcomingMovies(page),
    [page]
  );
}

// Hook for movie details with credits and reviews
export function useMovieDetails(movieId: number | null) {
  return useTMDB(
    () => {
      if (!movieId) throw new Error('Movie ID is required');
      return tmdbClient.getMovieDetails(movieId, 'credits,reviews');
    },
    [movieId],
    { immediate: !!movieId }
  );
}

// Hook for movie genres
export function useMovieGenres() {
  return useTMDB(
    () => tmdbClient.getMovieGenres(),
    []
  );
}

// Hook for search movies
export function useSearchMovies(query: string, page: number = 1) {
  return useTMDB(
    () => tmdbClient.searchMovies(query, page),
    [query, page],
    { immediate: !!query.trim() }
  );
}

// Hook for movies by genre
export function useMoviesByGenre(genreId: number | null, page: number = 1) {
  return useTMDB(
    () => {
      if (!genreId) throw new Error('Genre ID is required');
      return tmdbClient.getMoviesByGenre(genreId, page);
    },
    [genreId, page],
    { immediate: !!genreId }
  );
}

// Hook for discover movies with filters
export function useDiscoverMovies(params: {
  page?: number;
  genre?: number;
  year?: number;
  sortBy?: string;
  voteAverage?: number;
  voteCount?: number;
} = {}) {
  return useTMDB(
    () => tmdbClient.discoverMovies(params),
    [params]
  );
}

// Hook for paginated movie data
export interface UsePaginatedMoviesState {
  movies: TMDBMovie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalPages: number;
  currentPage: number;
  totalResults: number;
}

export function usePaginatedMovies(
  apiCall: (page: number) => Promise<TMDBResponse<TMDBMovie>>,
  options: {
    immediate?: boolean;
    onError?: (error: any) => void;
  } = {}
): UsePaginatedMoviesState {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const { immediate = true, onError } = options;

  const loadPage = useCallback(async (page: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(page);
      
      if (append) {
        setMovies(prev => [...prev, ...result.results]);
      } else {
        setMovies(result.results);
      }
      
      setCurrentPage(result.page);
      setTotalPages(result.total_pages);
      setTotalResults(result.total_results);
      setHasMore(result.page < result.total_pages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiCall, onError, toast]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPage(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadPage]);

  const refresh = useCallback(() => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    loadPage(1, false);
  }, [loadPage]);

  useEffect(() => {
    if (immediate) {
      loadPage(1, false);
    }
  }, [immediate, loadPage]);

  return {
    movies,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalPages,
    currentPage,
    totalResults,
  };
}

// Hook for paginated popular movies
export function usePaginatedPopularMovies() {
  return usePaginatedMovies((page) => tmdbClient.getPopularMovies(page));
}

// Hook for paginated trending movies
export function usePaginatedTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return usePaginatedMovies((page) => tmdbClient.getTrendingMovies(timeWindow, page));
}

// Hook for paginated top rated movies
export function usePaginatedTopRatedMovies() {
  return usePaginatedMovies((page) => tmdbClient.getTopRatedMovies(page));
}

// Hook for paginated search results
export function usePaginatedSearchMovies(query: string) {
  return usePaginatedMovies(
    (page) => tmdbClient.searchMovies(query, page),
    { immediate: !!query.trim() }
  );
}

// Hook for paginated genre movies
export function usePaginatedGenreMovies(genreId: number) {
  return usePaginatedMovies(
    (page) => tmdbClient.getMoviesByGenre(genreId, page),
    { immediate: !!genreId }
  );
}

// Hook for paginated discover movies with filters
export function usePaginatedDiscoverMovies(params: {
  page?: number;
  genre?: number;
  year?: number;
  sortBy?: string;
  voteAverage?: number;
  voteCount?: number;
} = {}) {
  return usePaginatedMovies(
    (page) => tmdbClient.discoverMovies({ ...params, page }),
    { immediate: true }
  );
}

// Utility hook for movie images
export function useMovieImages(movie: TMDBMovie | null) {
  if (!movie) {
    return {
      poster: '/placeholder-movie.jpg',
      backdrop: '/placeholder-backdrop.jpg',
    };
  }

  return {
    poster: tmdbClient.getImageURL(movie.poster_path),
    backdrop: tmdbClient.getBackdropURL(movie.backdrop_path),
  };
}

// Utility hook for movie details images
export function useMovieDetailsImages(movie: TMDBMovieDetails | null) {
  if (!movie) {
    return {
      poster: '/placeholder-movie.jpg',
      backdrop: '/placeholder-backdrop.jpg',
    };
  }

  return {
    poster: tmdbClient.getImageURL(movie.poster_path),
    backdrop: tmdbClient.getBackdropURL(movie.backdrop_path),
  };
}

// Utility hook for cast profile images
export function useCastImages(cast: any[] | null) {
  if (!cast) return [];

  return cast.map(person => ({
    ...person,
    profileUrl: tmdbClient.getProfileURL(person.profile_path),
  }));
}
