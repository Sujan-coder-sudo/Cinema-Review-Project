// TMDB API service layer
// Handles all TMDB API calls with proper error handling and type safety

export interface TMDBConfig {
  baseURL: string;
  apiKey: string;
  imageBaseURL: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  genres: TMDBGenre[];
  homepage: string;
  imdb_id: string;
  original_language: string;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string;
  credits?: TMDBMovieCredits;
  reviews?: TMDBMovieReviews;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBMovieCredits {
  cast: TMDBPerson[];
  crew: TMDBPerson[];
}

export interface TMDBPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface TMDBMovieReviews {
  page: number;
  results: TMDBReview[];
  total_pages: number;
  total_results: number;
}

export interface TMDBReview {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

// TMDB API Client
class TMDBClient {
  private config: TMDBConfig;

  constructor() {
    this.config = {
      baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
      apiKey: import.meta.env.VITE_TMDB_API_KEY || '',
      imageBaseURL: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
    };

    if (!this.config.apiKey) {
      console.error('TMDB API key not found. Please set VITE_TMDB_API_KEY in your .env file');
    }
  }

  async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.config.baseURL}${endpoint}`);
    
    // Add API key to params
    params.api_key = this.config.apiKey;
    
    // Add all params to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB API Request Failed:', error);
      throw error;
    }
  }

  // Get image URL with size and fallback
  getImageURL(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return '/placeholder-movie.jpg'; // Fallback image
    }
    return `${this.config.imageBaseURL}/${size}${path}`;
  }

  // Get backdrop URL
  getBackdropURL(path: string | null, size: string = 'w1280'): string {
    if (!path) {
      return '/placeholder-backdrop.jpg'; // Fallback image
    }
    return `${this.config.imageBaseURL}/${size}${path}`;
  }

  // Get profile image URL
  getProfileURL(path: string | null, size: string = 'w185'): string {
    if (!path) {
      return '/placeholder-profile.jpg'; // Fallback image
    }
    return `${this.config.imageBaseURL}/${size}${path}`;
  }

  // Search API
  async searchMulti(query: string, page: number = 1): Promise<any[]> {
    try {
      const response = await this.request<{ results: any[] }>('/search/multi', {
        query,
        page,
        include_adult: false,
      });
      
      // Filter out adult content and ensure we have valid results
      return response.results.filter((item: any) => 
        !item.adult && 
        (item.media_type === 'movie' || item.media_type === 'person' || item.media_type === 'tv')
      );
    } catch (error) {
      console.error('Error in searchMulti:', error);
      return [];
    }
  }

  // Movies API
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/movie/popular', { page });
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page });
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/movie/now_playing', { page });
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/movie/upcoming', { page });
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`, { page });
  }

  async getMovieDetails(id: number, appendToResponse?: string): Promise<TMDBMovieDetails> {
    const params: Record<string, any> = {};
    if (appendToResponse) {
      params.append_to_response = appendToResponse;
    }
    return this.request<TMDBMovieDetails>(`/movie/${id}`, params);
  }

  // Get person details with optional appended data
  // Using a broad return type here to avoid cross-file type coupling
  async getPersonDetails(personId: number, appendToResponse?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (appendToResponse) {
      params.append_to_response = appendToResponse;
    }
    return this.request<any>(`/person/${personId}`, params);
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/search/movie', { 
      query, 
      page,
      include_adult: false 
    });
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    });
  }

  // Genres API
  async getMovieGenres(): Promise<TMDBGenresResponse> {
    return this.request<TMDBGenresResponse>('/genre/movie/list');
  }

  // Discover API
  async discoverMovies(params: {
    page?: number;
    genre?: number;
    year?: number;
    sortBy?: string;
    voteAverage?: number;
    voteCount?: number;
    query?: string;
  } = {}): Promise<TMDBResponse<TMDBMovie>> {
    const {
      page = 1,
      genre,
      year,
      sortBy = 'popularity.desc',
      voteAverage,
      voteCount,
      query
    } = params;

    // If a free-text search query is provided, route to the search endpoint
    if (query && query.trim().length > 0) {
      return this.searchMovies(query, page);
    }

    const queryParams: Record<string, any> = {
      page,
      sort_by: sortBy,
      include_adult: false
    };

    if (genre) queryParams.with_genres = genre;
    if (year) queryParams.year = year;
    if (voteAverage) queryParams.vote_average_gte = voteAverage;
    if (voteCount) queryParams.vote_count_gte = voteCount;

    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', queryParams);
  }
}

// Create and export TMDB client instance
export const tmdbClient = new TMDBClient();

// Helper functions
export const formatReleaseYear = (releaseDate: string): string => {
  if (!releaseDate) return 'N/A';
  return new Date(releaseDate).getFullYear().toString();
};

export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getDirectorFromCredits = (credits?: TMDBMovieCredits): TMDBPerson | null => {
  if (!credits?.crew) return null;
  return credits.crew.find(person => person.job === 'Director') || null;
};

export const getMainCast = (credits?: TMDBMovieCredits, limit: number = 6): TMDBPerson[] => {
  if (!credits?.cast) return [];
  return credits.cast.slice(0, limit);
};

export const getProductionCompanies = (companies: TMDBProductionCompany[]): string[] => {
  return companies.map(company => company.name);
};

export default tmdbClient;
