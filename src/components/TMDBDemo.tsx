import React, { useState } from 'react';
import { Play, Star, Calendar, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePopularMovies, useTrendingMovies, useTopRatedMovies } from '@/hooks/useTMDB';
import TMDBMovieCard, { TMDBMovieGrid, TMDBMovieGridSkeleton } from '@/components/TMDBMovieCard';
import { tmdbClient, formatReleaseYear } from '@/lib/tmdb';

/**
 * TMDB Demo Component
 * Showcases the TMDB API integration with real data
 */
const TMDBDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('popular');

  // Fetch different movie categories
  const { data: popularMovies, loading: popularLoading } = usePopularMovies();
  const { data: trendingMovies, loading: trendingLoading } = useTrendingMovies('week');
  const { data: topRatedMovies, loading: topRatedLoading } = useTopRatedMovies();

  const getTabData = () => {
    switch (activeTab) {
      case 'trending':
        return {
          movies: trendingMovies?.results?.slice(0, 8) || [],
          loading: trendingLoading,
          title: 'Trending This Week',
          icon: <Users className="h-5 w-5" />,
          description: 'Movies that are trending right now'
        };
      case 'top-rated':
        return {
          movies: topRatedMovies?.results?.slice(0, 8) || [],
          loading: topRatedLoading,
          title: 'Top Rated Movies',
          icon: <Award className="h-5 w-5" />,
          description: 'Highest rated movies of all time'
        };
      default:
        return {
          movies: popularMovies?.results?.slice(0, 8) || [],
          loading: popularLoading,
          title: 'Popular Movies',
          icon: <Star className="h-5 w-5" />,
          description: 'Most popular movies right now'
        };
    }
  };

  const tabData = getTabData();
  const featuredMovie = tabData.movies[0];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cinema-gold to-cinema-purple bg-clip-text text-transparent">
          TMDB API Integration Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience real movie data from The Movie Database (TMDB) with our fully responsive React components.
          This demo showcases live API integration with loading states, error handling, and beautiful UI.
        </p>
      </div>

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <Card className="card-gradient overflow-hidden">
          <div className="relative h-96">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${tmdbClient.getBackdropURL(featuredMovie.backdrop_path, 'w1280')})` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
            
            <div className="relative h-full flex items-end p-8">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30">
                  Featured Movie
                </Badge>
                <h2 className="text-4xl font-bold text-white mb-4">
                  {featuredMovie.title}
                </h2>
                <div className="flex items-center gap-4 mb-4 text-white">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-cinema-gold fill-current" />
                    <span className="font-semibold">{featuredMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatReleaseYear(featuredMovie.release_date)}</span>
                  </div>
                </div>
                <p className="text-white/90 mb-6 line-clamp-3">
                  {featuredMovie.overview}
                </p>
                <Button size="lg" className="btn-gold">
                  <Play className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Movie Categories Tabs */}
      <Card className="card-gradient">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  {tabData.icon}
                  {tabData.title}
                </h3>
                <p className="text-muted-foreground">{tabData.description}</p>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {tabData.loading ? (
                <TMDBMovieGridSkeleton count={8} />
              ) : (
                <TMDBMovieGrid 
                  movies={tabData.movies} 
                  variant="default"
                  showGenres={true}
                  showRating={true}
                  showYear={true}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* API Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-gradient p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-cinema-gold/20 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6 text-cinema-gold" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Real Movie Data</h3>
          <p className="text-muted-foreground text-sm">
            Live data from TMDB API including ratings, genres, cast, and reviews
          </p>
        </Card>

        <Card className="card-gradient p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-cinema-gold/20 rounded-full flex items-center justify-center">
            <Calendar className="h-6 w-6 text-cinema-gold" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Advanced Filtering</h3>
          <p className="text-muted-foreground text-sm">
            Filter by genre, year, rating, and sort by various criteria
          </p>
        </Card>

        <Card className="card-gradient p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-cinema-gold/20 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-cinema-gold" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
          <p className="text-muted-foreground text-sm">
            Beautiful UI that works perfectly on all devices and screen sizes
          </p>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card className="card-gradient p-6">
        <h3 className="text-xl font-bold mb-4">🚀 Quick Setup</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">1</Badge>
            <div>
              <strong>Get TMDB API Key:</strong> Visit{' '}
              <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-cinema-gold hover:underline">
                TMDB API Settings
              </a>{' '}
              (free registration required)
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">2</Badge>
            <div>
              <strong>Create .env.local:</strong> Add your API key to the environment file
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">3</Badge>
            <div>
              <strong>Run the app:</strong> <code className="bg-muted px-2 py-1 rounded">npm run dev</code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TMDBDemo;
