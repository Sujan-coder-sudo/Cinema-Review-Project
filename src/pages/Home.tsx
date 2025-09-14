import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Play, ArrowRight, Star, Clock, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MovieCard from '@/components/MovieCard';
import StarRating from '@/components/StarRating';
import { useApp } from '@/contexts/AppContext';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { state } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get featured movies (highest rated)
  const featuredMovies = state.movies
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);
  
  // Get trending movies (recent years)
  const trendingMovies = state.movies
    .filter(movie => movie.year >= 2019)
    .slice(0, 8);

  // Get popular genres
  const popularGenres = ['Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy'];

  // Carousel functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel movies={featuredMovies} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />

      {/* Quick Stats */}
      <QuickStats />

      {/* Featured Movies */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-cinema-gold" />
              <h2 className="text-3xl font-bold text-foreground">Top Rated Movies</h2>
            </div>
            <Button variant="ghost" className="text-cinema-gold hover:text-cinema-gold/80" asChild>
              <Link to="/movies">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="large" />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Genres */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore by Genre</h2>
            <p className="text-muted-foreground text-lg">Discover movies by your favorite genres</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {popularGenres.map((genre) => (
              <Button
                key={genre}
                variant="outline"
                className="px-6 py-3 border-cinema-purple/30 hover:bg-cinema-purple/10 hover:border-cinema-gold transition-all duration-300"
                asChild
              >
                <Link to={`/movies?genre=${genre.toLowerCase()}`}>
                  {genre}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-16 bg-gradient-to-br from-cinema-purple/5 to-cinema-blue/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-cinema-gold" />
              <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
            </div>
            <Button variant="ghost" className="text-cinema-gold hover:text-cinema-gold/80" asChild>
              <Link to="/movies?sort=trending">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <PlatformStats moviesCount={state.movies.length} reviewsCount={state.reviews.length} />
    </div>
  );
};

// Loading Skeleton Component
const HomeSkeleton = () => (
  <div className="min-h-screen">
    <Skeleton className="h-[80vh] w-full" />
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Hero Carousel Component
const HeroCarousel = ({ movies, currentSlide, setCurrentSlide }: {
  movies: any[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}) => {
  if (!movies.length) return null;

  const currentMovie = movies[currentSlide];

  return (
    <section className="relative h-[85vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-darker/95 via-cinema-darker/70 to-transparent" />
      
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-6 w-6 text-cinema-gold" />
              <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30">
                Featured Movie
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <StarRating rating={currentMovie.avgRating} size="lg" />
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span>{currentMovie.year}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span>{currentMovie.duration}m</span>
              </div>
              <div className="flex gap-2">
                {currentMovie.genre.slice(0, 2).map((g: string) => (
                  <Badge key={g} variant="outline" className="border-white/30 text-white/90">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-2xl">
              {currentMovie.synopsis}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-gold text-lg px-8 py-6 shadow-lg hover:shadow-cinema-gold/20" asChild>
                <Link to={`/movies/${currentMovie.id}`}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link to={`/movies/${currentMovie.id}`}>
                  More Info
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-cinema-gold scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Quick Stats Component
const QuickStats = () => (
  <section className="py-8 bg-gradient-to-r from-cinema-purple/10 to-cinema-blue/10 border-y border-cinema-purple/20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-cinema-gold mb-1">4.8★</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-cinema-gold mb-1">1.2M+</div>
          <div className="text-sm text-muted-foreground">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-cinema-gold mb-1">50K+</div>
          <div className="text-sm text-muted-foreground">Movies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-cinema-gold mb-1">500K+</div>
          <div className="text-sm text-muted-foreground">Users</div>
        </div>
      </div>
    </div>
  </section>
);

// Platform Stats Component
const PlatformStats = ({ moviesCount, reviewsCount }: { moviesCount: number; reviewsCount: number }) => (
  <section className="py-16 bg-gradient-to-r from-cinema-purple/20 to-cinema-blue/20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Community</h2>
        <p className="text-muted-foreground text-lg">Be part of the world's largest movie review platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="card-gradient p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-cinema-gold mb-3">
            {moviesCount}+
          </div>
          <div className="text-lg text-muted-foreground mb-2">Movies Reviewed</div>
          <div className="text-sm text-cinema-gold/80">From classics to latest releases</div>
        </Card>
        
        <Card className="card-gradient p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-cinema-gold mb-3">
            {reviewsCount}+
          </div>
          <div className="text-lg text-muted-foreground mb-2">User Reviews</div>
          <div className="text-sm text-cinema-gold/80">Honest opinions from real movie lovers</div>
        </Card>
        
        <Card className="card-gradient p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-cinema-gold mb-3">
            <Users className="h-10 w-10 mx-auto" />
          </div>
          <div className="text-lg text-muted-foreground mb-2">Active Community</div>
          <div className="text-sm text-cinema-gold/80">Join discussions and share your thoughts</div>
        </Card>
      </div>
    </div>
  </section>
);

export default Home;