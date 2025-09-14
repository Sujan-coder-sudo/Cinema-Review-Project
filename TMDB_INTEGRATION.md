# TMDB API Integration Guide

This guide explains how to set up and use the TMDB (The Movie Database) API integration in the CinemaReview application.

## 🎬 Features

### Implemented TMDB Features
- **Hero Carousel**: Featured movies with backdrop images and auto-rotation
- **Movie Discovery**: Browse movies with advanced filtering (genre, year, rating, sort)
- **Movie Details**: Complete movie information including cast, crew, reviews, and production details
- **Search Functionality**: Real-time search with debouncing
- **Responsive Design**: Optimized for all screen sizes
- **Loading States**: Beautiful skeletons and loading indicators
- **Error Handling**: Comprehensive error boundaries and user feedback

### TMDB API Endpoints Used
- `GET /movie/popular` - Popular movies
- `GET /movie/top_rated` - Top rated movies
- `GET /movie/now_playing` - Now playing movies
- `GET /movie/upcoming` - Upcoming movies
- `GET /trending/movie/{time_window}` - Trending movies
- `GET /movie/{movie_id}?append_to_response=credits,reviews` - Movie details with cast and reviews
- `GET /genre/movie/list` - Movie genres
- `GET /discover/movie` - Discover movies with filters
- `GET /search/movie` - Search movies

## 🚀 Setup Instructions

### 1. Get TMDB API Key

1. Visit [TMDB API](https://www.themoviedb.org/settings/api)
2. Create an account or log in
3. Request an API key (it's free!)
4. Copy your API key

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_actual_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=CinemaReview
```

### 3. Install Dependencies

All required dependencies are already included in the project:
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router
- React Query (for caching)

### 4. Start the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 File Structure

```
src/
├── lib/
│   └── tmdb.ts                 # TMDB API client and types
├── hooks/
│   └── useTMDB.ts             # Custom hooks for TMDB API calls
├── components/
│   └── TMDBMovieCard.tsx      # Movie card component with TMDB data
├── pages/
│   ├── TMDBHome.tsx           # Home page with TMDB integration
│   ├── TMDBMovies.tsx         # Movies listing with filters
│   └── TMDBMovieDetail.tsx    # Movie detail page
└── App.tsx                    # Updated routes
```

## 🔧 Key Components

### TMDB API Client (`src/lib/tmdb.ts`)
- Centralized API client with error handling
- Type-safe interfaces for all TMDB data
- Image URL helpers with fallbacks
- Utility functions for formatting data

### Custom Hooks (`src/hooks/useTMDB.ts`)
- `usePopularMovies()` - Fetch popular movies
- `useTrendingMovies()` - Fetch trending movies
- `useMovieDetails()` - Fetch movie details with credits and reviews
- `useMovieGenres()` - Fetch available genres
- `usePaginatedDiscoverMovies()` - Paginated movie discovery with filters

### Movie Components
- `TMDBMovieCard` - Reusable movie card component
- `TMDBMovieGrid` - Grid layout for multiple movies
- Loading skeletons for better UX

## 🎨 UI Features

### Home Page (`TMDBHome.tsx`)
- **Hero Carousel**: Auto-rotating featured movies with backdrop images
- **Quick Stats**: Platform statistics
- **Top Rated Section**: Highest rated movies
- **Trending Section**: Weekly trending movies
- **Genre Filter**: Popular movie genres
- **Popular Movies**: Most popular movies

### Movies Page (`TMDBMovies.tsx`)
- **Advanced Filtering**: Genre, year, rating, sort options
- **Search**: Real-time search with debouncing
- **View Modes**: Grid and list view
- **Pagination**: Load more functionality
- **Mobile Responsive**: Collapsible filters for mobile

### Movie Detail Page (`TMDBMovieDetail.tsx`)
- **Hero Section**: Backdrop image with movie info
- **Cast & Crew**: Director and main cast with profile images
- **Reviews**: TMDB reviews with ratings
- **Movie Details**: Runtime, budget, revenue, production companies
- **Watchlist**: Add/remove from watchlist
- **Share**: Social sharing functionality

## 🎯 Usage Examples

### Fetching Popular Movies
```typescript
import { usePopularMovies } from '@/hooks/useTMDB';

const MyComponent = () => {
  const { data: movies, loading, error } = usePopularMovies();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {movies?.results.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
};
```

### Fetching Movie Details with Cast and Reviews
```typescript
import { useMovieDetails } from '@/hooks/useTMDB';

const MovieDetail = ({ movieId }: { movieId: number }) => {
  const { data: movie, loading } = useMovieDetails(movieId);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{movie?.title}</h1>
      <p>{movie?.overview}</p>
      
      {/* Cast */}
      <div>
        {movie?.credits?.cast.slice(0, 6).map(actor => (
          <div key={actor.id}>
            <img src={tmdbClient.getProfileURL(actor.profile_path)} alt={actor.name} />
            <span>{actor.name}</span>
          </div>
        ))}
      </div>
      
      {/* Reviews */}
      <div>
        {movie?.reviews?.results.map(review => (
          <div key={review.id}>
            <h3>{review.author}</h3>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Using the Movie Card Component
```typescript
import TMDBMovieCard, { TMDBMovieGrid } from '@/components/TMDBMovieCard';

const MovieList = ({ movies }: { movies: any[] }) => {
  return (
    <TMDBMovieGrid 
      movies={movies} 
      variant="default"
      showGenres={true}
      showRating={true}
      showYear={true}
    />
  );
};
```

## 🔍 Filtering and Search

### Available Filters
- **Genre**: Filter by movie genre (Action, Drama, Comedy, etc.)
- **Year**: Filter by release year (1920 - current year)
- **Rating**: Minimum rating filter (4+ to 8+ stars)
- **Sort**: Sort by popularity, rating, release date, revenue, etc.
- **Search**: Text search by movie title

### Filter Usage
```typescript
// In TMDBMovies.tsx
const filters = {
  genre: '28', // Action genre ID
  year: '2023',
  sortBy: 'vote_average.desc',
  voteAverage: 7.0
};

const { movies } = usePaginatedDiscoverMovies(filters);
```

## 🖼️ Image Handling

### Image URLs
```typescript
import { tmdbClient } from '@/lib/tmdb';

// Movie poster
const posterUrl = tmdbClient.getImageURL(movie.poster_path, 'w500');

// Backdrop image
const backdropUrl = tmdbClient.getBackdropURL(movie.backdrop_path, 'w1920');

// Profile image
const profileUrl = tmdbClient.getProfileURL(person.profile_path, 'w185');
```

### Available Image Sizes
- **Posters**: w92, w154, w185, w342, w500, w780, original
- **Backdrops**: w300, w780, w1280, original
- **Profiles**: w45, w185, h632, original

## 🎭 Data Types

### Key TypeScript Interfaces
```typescript
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  genres: TMDBGenre[];
  runtime: number;
  credits?: TMDBMovieCredits;
  reviews?: TMDBMovieReviews;
}
```

## 🚨 Error Handling

### API Error Handling
```typescript
const { data, loading, error } = usePopularMovies();

if (error) {
  // Error is automatically displayed via toast
  // You can also handle it manually:
  console.error('Failed to fetch movies:', error);
}
```

### Network Error Handling
The API client includes:
- Automatic retry logic
- Network status detection
- Offline handling
- Error boundaries for component crashes

## 🔧 Customization

### Adding New API Endpoints
1. Add the endpoint to `tmdbClient` in `src/lib/tmdb.ts`
2. Create a custom hook in `src/hooks/useTMDB.ts`
3. Use the hook in your components

### Customizing Movie Cards
```typescript
<TMDBMovieCard
  movie={movie}
  variant="large" // 'default' | 'large' | 'compact'
  showGenres={true}
  showRating={true}
  showYear={true}
/>
```

### Customizing Filters
Add new filter options in `TMDBMovies.tsx`:
```typescript
// Add to filter state
const [filters, setFilters] = useState({
  // ... existing filters
  language: '',
  certification: '',
});
```

## 🎯 Performance Optimization

### Implemented Optimizations
- **Image Lazy Loading**: Images load as they come into view
- **Debounced Search**: Prevents excessive API calls
- **Pagination**: Load movies in batches
- **Caching**: React Query caches API responses
- **Skeleton Loading**: Better perceived performance
- **Code Splitting**: Lazy load routes

### Best Practices
- Use appropriate image sizes for different screen sizes
- Implement infinite scroll for better UX
- Cache frequently accessed data
- Use React.memo for expensive components

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure your API key is correct
   - Check that the key has the right permissions
   - Verify the key is in `.env.local` (not `.env`)

2. **Images Not Loading**
   - Check if image paths are null (use fallback images)
   - Verify image URLs are correct
   - Check CORS settings

3. **Slow Loading**
   - Use smaller image sizes for thumbnails
   - Implement proper loading states
   - Check network tab for slow requests

### Debug Mode
Enable debug logging by adding to your `.env.local`:
```env
VITE_DEBUG_TMDB=true
```

## 📚 Additional Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [TMDB API Explorer](https://www.themoviedb.org/documentation/api)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

When adding new TMDB features:
1. Follow the existing code patterns
2. Add proper TypeScript types
3. Include error handling
4. Add loading states
5. Test with different API responses
6. Update this documentation

---

**Happy coding! 🎬✨**
