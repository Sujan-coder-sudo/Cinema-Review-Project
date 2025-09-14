import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Calendar, Clock, User, Heart, Share2, Play, Star, Loader2, ExternalLink, Award, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import MovieCard from '@/components/MovieCard';
import { useApp, useAuth } from '@/contexts/AppContext';
import { Review, Movie } from '@/lib/mockData';

const MovieDetail = () => {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  // Simulate API calls
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const movieResponse = await fetch(`http://localhost:5000/api/movies/${id}`);
        // const reviewsResponse = await fetch(`http://localhost:5000/api/movies/${id}/reviews`);
        // const similarResponse = await fetch(`http://localhost:5000/api/movies/${id}/similar`);
        
        // For now, use mock data
        const foundMovie = state.movies.find(m => m.id === id);
        const movieReviews = state.reviews.filter(r => r.movieId === id);
        const similar = state.movies
          .filter(m => 
            m.id !== id && 
            m.genre.some(g => foundMovie?.genre.includes(g))
          )
          .slice(0, 6);
        
        setMovie(foundMovie || null);
        setReviews(movieReviews);
        setSimilarMovies(similar);
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Failed to fetch movie data:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id, state.movies, state.reviews, toast]);

  const isInWatchlist = user?.watchlist.includes(id || '') || false;

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return <Navigate to="/404" replace />;
  }

  const toggleWatchlist = async () => {
    if (!user || !id) return;
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/users/${user.id}/watchlist`, {
      //   method: isInWatchlist ? 'DELETE' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ movieId: id })
      // });
      
      if (isInWatchlist) {
        dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });
        toast({
          title: "Removed from Watchlist",
          description: `${movie.title} has been removed from your watchlist`,
        });
      } else {
        dispatch({ type: 'ADD_TO_WATCHLIST', payload: id });
        toast({
          title: "Added to Watchlist",
          description: `${movie.title} has been added to your watchlist`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  const submitReview = async () => {
    if (!user || !reviewText.trim() || reviewRating === 0) return;

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/movies/${movie.id}/reviews`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     rating: reviewRating,
      //     text: reviewText.trim()
      //   })
      // });

      const newReview: Review = {
        id: Date.now().toString(),
        userId: user.id,
        movieId: movie.id,
        username: user.username,
        rating: reviewRating,
        text: reviewText.trim(),
        timestamp: new Date().toISOString(),
        userAvatar: user.profilePic
      };

      dispatch({ type: 'ADD_REVIEW', payload: newReview });
      setReviewText('');
      setReviewRating(0);
      setShowReviewForm(false);
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const shareMovie = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on CinemaReview!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Movie link has been copied to clipboard",
      });
    }
  };

  const userHasReviewed = reviews.some(review => review.userId === user?.id);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
        
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-48 md:w-64 poster-aspect rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <StarRating rating={movie.avgRating} size="lg" />
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{movie.duration}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-5 w-5" />
                    <span>{movie.director}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((genre) => (
                    <Badge 
                      key={genre}
                      className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {movie.trailer && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="btn-gold" size="lg">
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
                            src={movie.trailer}
                            title={`${movie.title} Trailer`}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {user ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={toggleWatchlist}
                      className={`border-white/30 text-white hover:bg-white/10 ${
                        isInWatchlist ? 'bg-white/20' : ''
                      }`}
                    >
                      <Heart className={`mr-2 h-5 w-5 ${
                        isInWatchlist ? 'fill-red-500 text-red-500' : ''
                      }`} />
                      {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
                      <Link to="/login">
                        <Heart className="mr-2 h-5 w-5" />
                        Login to Add to Watchlist
                      </Link>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={shareMovie}
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
                <p className="text-muted-foreground leading-relaxed">
                  {movie.synopsis}
                </p>
              </Card>

              {/* Cast */}
              <Card className="card-gradient p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-cinema-gold" />
                  Cast & Crew
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-cinema-gold">Cast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {movie.cast.map((actor, index) => (
                        <div key={actor} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-cinema-purple/20 text-cinema-gold font-semibold">
                              {actor.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{actor}</div>
                            <div className="text-xs text-muted-foreground">Actor</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-cinema-gold">Director</h3>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-cinema-purple/20 text-cinema-gold font-semibold">
                          {movie.director.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{movie.director}</div>
                        <div className="text-sm text-muted-foreground">Director</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Reviews Section */}
              <Card className="card-gradient p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-cinema-gold" />
                    Reviews ({reviews.length})
                  </h2>
                  
                  {user ? (
                    !userHasReviewed ? (
                      <Button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-cinema-purple hover:bg-cinema-purple/80"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Write Review
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold">
                        You've reviewed this movie
                      </Badge>
                    )
                  ) : (
                    <Button variant="outline" asChild>
                      <Link to="/login">
                        <Star className="mr-2 h-4 w-4" />
                        Login to Review
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Review Stats */}
                {reviews.length > 0 && (
                  <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Rating</span>
                      <div className="flex items-center gap-2">
                        <StarRating rating={movie.avgRating} size="sm" />
                        <span className="text-sm font-semibold">{movie.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <Card className="p-4 mb-6 bg-secondary/50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Your Rating
                        </label>
                        <StarRating
                          rating={reviewRating}
                          interactive
                          onRatingChange={setReviewRating}
                          size="lg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Your Review
                        </label>
                        <Textarea
                          placeholder="Share your thoughts about this movie..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={submitReview}
                          disabled={!reviewText.trim() || reviewRating === 0}
                          className="bg-cinema-gold text-cinema-darker hover:bg-cinema-gold/90"
                        >
                          Submit Review
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={review.id}>
                        <ReviewCard review={review} />
                        {index < reviews.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No reviews yet</p>
                      <p>Be the first to share your thoughts about this movie!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Movie Details */}
              <Card className="card-gradient p-6">
                <h3 className="text-xl font-bold mb-4">Movie Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Director</span>
                    <div className="font-medium">{movie.director}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Release Year</span>
                    <div className="font-medium">{movie.year}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <div className="font-medium">{movie.duration} minutes</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Rating</span>
                    <div className="font-medium flex items-center space-x-2">
                      <StarRating rating={movie.avgRating} size="sm" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Similar Movies */}
              <Card className="card-gradient p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-cinema-gold" />
                  Similar Movies
                </h3>
                {similarMovies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {similarMovies.slice(0, 4).map((similarMovie) => (
                      <Link
                        key={similarMovie.id}
                        to={`/movies/${similarMovie.id}`}
                        className="group flex space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <img
                          src={similarMovie.poster}
                          alt={similarMovie.title}
                          className="w-12 h-18 object-cover rounded shadow-md group-hover:shadow-lg transition-shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm line-clamp-2 group-hover:text-cinema-gold transition-colors">
                            {similarMovie.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {similarMovie.year} • {similarMovie.duration}m
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={similarMovie.avgRating} size="sm" />
                            <span className="text-xs text-muted-foreground">
                              {similarMovie.avgRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No similar movies found</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Loading Skeleton Component
const MovieDetailSkeleton = () => (
  <div className="min-h-screen">
    {/* Hero Skeleton */}
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-darker via-cinema-darker/60 to-transparent" />
      
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <Skeleton className="w-48 md:w-64 h-72 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-3">
                    <Skeleton className="w-12 h-18 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
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

export default MovieDetail;