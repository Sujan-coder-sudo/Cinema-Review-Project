import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star, TrendingUp, Users, Film, Award, Calendar, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import TMDBMovieCard, { TMDBMovieGrid, TMDBMovieGridSkeleton } from '@/components/TMDBMovieCard';
import { usePopularMovies, useTrendingMovies, useTopRatedMovies, useMovieGenres } from '@/hooks/useTMDB';
import { tmdbClient, formatReleaseYear } from '@/lib/tmdb';

const TMDBHome: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch TMDB data
  const { data: popularMovies, loading: popularLoading } = usePopularMovies();
  const { data: trendingMovies, loading: trendingLoading } = useTrendingMovies('week');
  const { data: topRatedMovies, loading: topRatedLoading } = useTopRatedMovies();
  const { data: genresData, loading: genresLoading } = useMovieGenres();

  const featuredMovies = popularMovies?.results?.slice(0, 5) || [];
  const trendingMoviesList = trendingMovies?.results?.slice(0, 8) || [];
  const topRatedMoviesList = topRatedMovies?.results?.slice(0, 6) || [];
  const genres = genresData?.genres || [];

  // Carousel functionality
  useEffect(() => {
    if (featuredMovies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredMovies.length]);

  const loading = popularLoading || trendingLoading || topRatedLoading || genresLoading;

  if (loading) {
    return <TMDBHomeSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel 
        movies={featuredMovies} 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      
      {/* Quick Stats */}
      <QuickStats />
      
      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-16">
            {/* Top Rated Movies */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cinema-gold/20 rounded-xl">
                    <Award className="h-8 w-8 text-cinema-gold" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Top Rated Movies</h2>
                    <p className="text-muted-foreground">Critically acclaimed masterpieces</p>
                  </div>
                </div>
                <Button variant="outline" className="btn-outline hidden sm:flex" asChild>
                  <Link to="/movies?sort=rating">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <TMDBMovieGrid 
                movies={topRatedMoviesList} 
                variant="default"
                className="mb-8"
              />
            </section>

            {/* Trending Now */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cinema-gold/20 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-cinema-gold" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Trending This Week</h2>
                    <p className="text-muted-foreground">What everyone's watching right now</p>
                  </div>
                </div>
                <Button variant="outline" className="btn-outline hidden sm:flex" asChild>
                  <Link to="/movies?sort=trending">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <TMDBMovieGrid 
                movies={trendingMoviesList} 
                variant="default"
                className="mb-8"
              />
            </section>

            {/* Popular Movies */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cinema-gold/20 rounded-xl">
                    <Star className="h-8 w-8 text-cinema-gold" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Popular Movies</h2>
                    <p className="text-muted-foreground">Most popular movies right now</p>
                  </div>
                </div>
                <Button variant="outline" className="btn-outline hidden sm:flex" asChild>
                  <Link to="/movies">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <TMDBMovieGrid 
                movies={featuredMovies} 
                variant="default"
                className="mb-8"
              />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            {/* Popular Genres */}
            <Card className="card-gradient p-6">
              <div className="flex items-center gap-3 mb-6">
                <Film className="h-6 w-6 text-cinema-gold" />
                <h3 className="text-xl font-bold">Popular Genres</h3>
              </div>
              
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
                {genres.slice(0, 8).map((genre) => (
                  <Link key={genre.id} to={`/movies?genre=${genre.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-cinema-gold/10 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 bg-cinema-gold/20 rounded-full flex items-center justify-center group-hover:bg-cinema-gold/30 transition-colors">
                        <Film className="h-4 w-4 text-cinema-gold" />
                      </div>
                      <span className="font-medium group-hover:text-cinema-gold transition-colors">
                        {genre.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Quick Stats Card */}
            <Card className="card-gradient p-6">
              <h3 className="text-xl font-bold mb-6">Platform Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Movies</span>
                  <span className="font-semibold text-cinema-gold">10,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-semibold text-cinema-gold">1M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-semibold text-cinema-gold">50,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Rating</span>
                  <span className="font-semibold text-cinema-gold">4.8★</span>
                </div>
              </div>
            </Card>

            {/* Featured Collection */}
            <Card className="card-gradient p-6">
              <h3 className="text-xl font-bold mb-4">Featured Collection</h3>
              <div className="space-y-3">
                <Link to="/movies?genre=28" className="block">
                  <div className="p-3 bg-cinema-gold/10 rounded-lg hover:bg-cinema-gold/20 transition-colors">
                    <h4 className="font-semibold">Action Movies</h4>
                    <p className="text-sm text-muted-foreground">High-octane thrills</p>
                  </div>
                </Link>
                <Link to="/movies?genre=35" className="block">
                  <div className="p-3 bg-cinema-gold/10 rounded-lg hover:bg-cinema-gold/20 transition-colors">
                    <h4 className="font-semibold">Comedy Gold</h4>
                    <p className="text-sm text-muted-foreground">Laugh out loud</p>
                  </div>
                </Link>
                <Link to="/movies?genre=18" className="block">
                  <div className="p-3 bg-cinema-gold/10 rounded-lg hover:bg-cinema-gold/20 transition-colors">
                    <h4 className="font-semibold">Drama Masterpieces</h4>
                    <p className="text-sm text-muted-foreground">Emotional journeys</p>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <PlatformStats />
    </div>
  );
};

// Hero Carousel Component
const HeroCarousel: React.FC<{
  movies: any[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}> = ({ movies, currentSlide, setCurrentSlide }) => {
  if (!movies.length) return null;

  const currentMovie = movies[currentSlide];

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${tmdbClient.getBackdropURL(currentMovie.backdrop_path, 'w1920')})` 
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-6 text-white">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-cinema-gold fill-current" />
                <span className="text-xl font-semibold">
                  {currentMovie.vote_average.toFixed(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatReleaseYear(currentMovie.release_date)}</span>
              </div>
              
              <Badge className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30">
                Popular
              </Badge>
            </div>
            
            <p className="text-xl text-white/90 mb-8 line-clamp-3 max-w-3xl">
              {currentMovie.overview}
            </p>
            
            <div className="flex gap-4">
              <Button size="lg" className="btn-gold text-lg px-8 py-6 shadow-lg hover:shadow-cinema-gold/20" asChild>
                <Link to={`/movies/${currentMovie.id}`}>
                  <Play className="mr-2 h-5 w-5" />
                  View Details
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                asChild
              >
                <Link to="/movies">
                  Browse All Movies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-cinema-gold scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={() => setCurrentSlide((currentSlide - 1 + movies.length) % movies.length)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={() => setCurrentSlide((currentSlide + 1) % movies.length)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </section>
  );
};

// Quick Stats Component
const QuickStats: React.FC = () => (
  <section className="py-12 bg-cinema-darker/30">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="card-gradient p-6 text-center">
          <Film className="h-8 w-8 text-cinema-gold mx-auto mb-2" />
          <div className="text-2xl font-bold">10,000+</div>
          <div className="text-muted-foreground">Movies</div>
        </Card>
        
        <Card className="card-gradient p-6 text-center">
          <Users className="h-8 w-8 text-cinema-gold mx-auto mb-2" />
          <div className="text-2xl font-bold">50,000+</div>
          <div className="text-muted-foreground">Reviews</div>
        </Card>
        
        <Card className="card-gradient p-6 text-center">
          <Star className="h-8 w-8 text-cinema-gold mx-auto mb-2" />
          <div className="text-2xl font-bold">4.8</div>
          <div className="text-muted-foreground">Avg Rating</div>
        </Card>
        
        <Card className="card-gradient p-6 text-center">
          <TrendingUp className="h-8 w-8 text-cinema-gold mx-auto mb-2" />
          <div className="text-2xl font-bold">1M+</div>
          <div className="text-muted-foreground">Users</div>
        </Card>
      </div>
    </div>
  </section>
);

// Platform Stats Component
const PlatformStats: React.FC = () => (
  <section className="py-16 bg-cinema-darker/40">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Discover, review, and share your favorite movies with millions of film enthusiasts worldwide.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="btn-gold text-lg px-8 py-6" asChild>
          <Link to="/movies">
            Start Exploring
          </Link>
        </Button>
        
        <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-6" asChild>
          <Link to="/auth">
            Join Now
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

// Loading Skeleton Component
const TMDBHomeSkeleton: React.FC = () => (
  <div className="min-h-screen">
    {/* Hero Skeleton */}
    <section className="relative h-[80vh] overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
      
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl space-y-4">
            <Skeleton className="h-16 w-3/4" />
            <div className="flex gap-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-full max-w-3xl" />
            <Skeleton className="h-6 w-2/3 max-w-2xl" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Quick Stats Skeleton */}
    <section className="py-12 bg-cinema-darker/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 text-center">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-6 w-16 mx-auto mb-1" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Sections Skeleton */}
    {[...Array(3)].map((_, i) => (
      <section key={i} className={`py-16 ${i % 2 === 1 ? 'bg-cinema-darker/20' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          
          <TMDBMovieGridSkeleton count={8} />
        </div>
      </section>
    ))}
  </div>
);

export default TMDBHome;
