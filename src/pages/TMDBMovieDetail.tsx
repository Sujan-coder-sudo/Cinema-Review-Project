import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Award, 
  Play, 
  Share2, 
  ExternalLink,
  DollarSign,
  Globe,
  Film,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMovieDetails, useCastImages } from '@/hooks/useTMDB';
import { 
  tmdbClient, 
  formatReleaseYear, 
  formatRuntime, 
  formatCurrency,
  getDirectorFromCredits,
  getMainCast,
  getProductionCompanies
} from '@/lib/tmdb';

const TMDBMovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const movieId = id ? parseInt(id, 10) : null;
  const { data: movie, loading, error } = useMovieDetails(movieId);

  // Get enhanced cast data with profile images
  const castWithImages = useCastImages(movie?.credits?.cast || null);

  useEffect(() => {
    // Check if movie is in watchlist (from localStorage for now)
    if (movieId) {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setIsInWatchlist(watchlist.includes(movieId));
    }
  }, [movieId]);

  const handleAddToWatchlist = () => {
    if (!movieId) return;
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isInWatchlist) {
      const newWatchlist = watchlist.filter((id: number) => id !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      setIsInWatchlist(false);
      toast({
        title: "Removed from Watchlist",
        description: `${movie?.title} has been removed from your watchlist`,
      });
    } else {
      watchlist.push(movieId);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
      toast({
        title: "Added to Watchlist",
        description: `${movie?.title} has been added to your watchlist`,
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie?.title || 'Movie',
          text: `Check out ${movie?.title} on CinemaReview!`,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Movie link has been copied to clipboard",
      });
    }
  };

  if (loading) {
    return <TMDBMovieDetailSkeleton />;
  }

  if (error || !movie) {
    return <Navigate to="/404" replace />;
  }

  const director = getDirectorFromCredits(movie.credits);
  const mainCast = getMainCast(movie.credits, 8);
  const productionCompanies = getProductionCompanies(movie.production_companies);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${tmdbClient.getBackdropURL(movie.backdrop_path, 'w1920')})` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
        
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col lg:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={tmdbClient.getImageURL(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-48 md:w-64 lg:w-80 poster-aspect rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-xl text-white/80 mb-4 italic">
                    "{movie.tagline}"
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-cinema-gold fill-current" />
                    <span className="text-lg font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-white/80">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-white/80">
                    <Calendar className="h-5 w-5" />
                    <span>{formatReleaseYear(movie.release_date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-white/80">
                    <Clock className="h-5 w-5" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-white/80">
                    <Globe className="h-5 w-5" />
                    <span>{movie.original_language.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <Badge 
                      key={genre.id}
                      className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {movie.video && (
                    <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
                      <DialogTrigger asChild>
                        <Button className="btn-gold text-lg px-8 py-6 shadow-lg hover:shadow-cinema-gold/20">
                          <Play className="mr-2 h-5 w-5" />
                          Watch Trailer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-cinema-darker border-cinema-purple/30">
                        <DialogHeader>
                          <DialogTitle className="text-white">{movie.title} - Trailer</DialogTitle>
                        </DialogHeader>
                        <div className="aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/dQw4w9WgXcQ`} // Placeholder - would need TMDB video API
                            title={`${movie.title} Trailer`}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToWatchlist}
                    className={`border-white/30 text-white hover:bg-white/10 ${
                      isInWatchlist ? 'bg-white/20' : ''
                    }`}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${
                      isInWatchlist ? 'fill-red-500 text-red-500' : ''
                    }`} />
                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleShare}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Synopsis */}
              <Card className="card-gradient p-6">
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </Card>

              {/* Cast & Crew */}
              <Card className="card-gradient p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-cinema-gold" />
                  Cast & Crew
                </h2>
                
                {director && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-cinema-gold">Director</h3>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tmdbClient.getProfileURL(director.profile_path)} />
                        <AvatarFallback className="bg-cinema-purple/20 text-cinema-gold font-semibold">
                          {director.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{director.name}</div>
                        <div className="text-sm text-muted-foreground">Director</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-cinema-gold">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {castWithImages.map((actor) => (
                      <div key={actor.id} className="flex flex-col items-center text-center">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={actor.profileUrl} />
                          <AvatarFallback className="bg-cinema-purple/20 text-cinema-gold font-semibold">
                            {actor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-sm">{actor.name}</div>
                        <div className="text-xs text-muted-foreground">{actor.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Reviews */}
              <Card className="card-gradient p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-cinema-gold" />
                    Reviews ({movie.reviews?.total_results || 0})
                  </h2>
                </div>

                {movie.reviews && movie.reviews.results.length > 0 ? (
                  <Tabs defaultValue="reviews" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="reviews" className="space-y-4">
                      {movie.reviews.results.slice(0, 3).map((review) => (
                        <div key={review.id} className="p-4 bg-secondary/30 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={tmdbClient.getProfileURL(review.author_details.avatar_path)} />
                              <AvatarFallback className="bg-cinema-purple/20 text-cinema-gold font-semibold">
                                {review.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{review.author}</span>
                                {review.author_details.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-cinema-gold fill-current" />
                                    <span className="text-sm">{review.author_details.rating}/10</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-4">
                                {review.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No reviews yet</p>
                    <p>Be the first to share your thoughts about this movie!</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Movie Details */}
              <Card className="card-gradient p-6">
                <h3 className="text-xl font-bold mb-4">Movie Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <div className="font-medium">{movie.status}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Release Date</span>
                    <div className="font-medium">{new Date(movie.release_date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Runtime</span>
                    <div className="font-medium">{formatRuntime(movie.runtime)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget</span>
                    <div className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(movie.budget)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue</span>
                    <div className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(movie.revenue)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Original Language</span>
                    <div className="font-medium">{movie.original_language.toUpperCase()}</div>
                  </div>
                  {movie.imdb_id && (
                    <div>
                      <span className="text-muted-foreground">IMDb</span>
                      <div className="font-medium">
                        <a 
                          href={`https://www.imdb.com/title/${movie.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cinema-gold hover:text-cinema-gold/80 flex items-center gap-1"
                        >
                          View on IMDb
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Production Companies */}
              {productionCompanies.length > 0 && (
                <Card className="card-gradient p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Film className="h-5 w-5 text-cinema-gold" />
                    Production
                  </h3>
                  <div className="space-y-2">
                    {productionCompanies.map((company, index) => (
                      <div key={index} className="text-sm">
                        {company}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Loading Skeleton Component
const TMDBMovieDetailSkeleton: React.FC = () => (
  <div className="min-h-screen">
    {/* Hero Skeleton */}
    <section className="relative h-[70vh] overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
      
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-end">
            <Skeleton className="w-48 md:w-64 lg:w-80 h-96 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Content Skeleton */}
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
            
            <Card className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default TMDBMovieDetail;
