export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type: 'movie' | 'tv' | 'person';
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
  // Add other movie-specific fields as needed
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    media_type: 'movie' | 'tv' | 'person';
  }>;
  media_type: 'movie' | 'tv' | 'person';
  adult?: boolean;
  popularity?: number;
  // Add other person-specific fields as needed
}

export interface PersonDetails extends Person {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  popularity: number;
  combined_credits: {
    cast: Array<{
      id: number;
      title?: string;
      name?: string;
      character?: string;
      poster_path: string | null;
      media_type: 'movie' | 'tv';
      release_date?: string;
      first_air_date?: string;
      vote_average: number;
    }>;
    crew: Array<{
      id: number;
      title?: string;
      name?: string;
      job: string;
      department: string;
      poster_path: string | null;
      media_type: 'movie' | 'tv';
      release_date?: string;
      first_air_date?: string;
      vote_average: number;
    }>;
  };
}

export interface SearchResults<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
