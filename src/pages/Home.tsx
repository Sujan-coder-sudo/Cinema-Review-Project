import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MovieCard from '@/components/MovieCard';
import StarRating from '@/components/StarRating';
import { useApp } from '@/contexts/AppContext';

const Home = () => {
  const { state } = useApp();
  
  // Get featured movies (highest rated)
  const featuredMovies = state.movies
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);
  
  // Get trending movies (recent years)
  const trendingMovies = state.movies
    .filter(movie => movie.year >= 2019)
    .slice(0, 6);

  const heroMovie = featuredMovies[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative h-[80vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroMovie.backdrop})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-darker/90 via-cinema-darker/60 to-transparent" />
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="h-6 w-6 text-cinema-gold" />
                  <span className="text-cinema-gold font-semibold">Featured Movie</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  {heroMovie.title}
                </h1>
                
                <div className="flex items-center space-x-6 mb-6">
                  <StarRating rating={heroMovie.avgRating} size="lg" />
                  <span className="text-white/80">{heroMovie.year}</span>
                  <span className="text-white/80">{heroMovie.duration}m</span>
                </div>
                
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  {heroMovie.synopsis}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-gold text-lg px-8 py-6" asChild>
                    <Link to={`/movies/${heroMovie.id}`}>
                      <Play className="mr-2 h-5 w-5" />
                      Watch Now
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link to={`/movies/${heroMovie.id}`}>
                      More Info
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Movies */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Top Rated Movies</h2>
            <Button variant="ghost" className="text-cinema-gold hover:text-cinema-gold/80" asChild>
              <Link to="/movies">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="large" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="h-6 w-6 text-cinema-gold" />
            <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-cinema-purple/20 to-cinema-blue/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-gradient p-6 text-center">
              <div className="text-3xl font-bold text-cinema-gold mb-2">
                {state.movies.length}+
              </div>
              <div className="text-muted-foreground">Movies Reviewed</div>
            </Card>
            
            <Card className="card-gradient p-6 text-center">
              <div className="text-3xl font-bold text-cinema-gold mb-2">
                {state.reviews.length}+
              </div>
              <div className="text-muted-foreground">User Reviews</div>
            </Card>
            
            <Card className="card-gradient p-6 text-center">
              <div className="text-3xl font-bold text-cinema-gold mb-2">
                4.7★
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;