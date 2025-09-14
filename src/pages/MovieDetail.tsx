import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, Clock, User, Heart, Share2, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import { useApp, useAuth } from '@/contexts/AppContext';
import { Review } from '@/lib/mockData';

const MovieDetail = () => {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const movie = state.movies.find(m => m.id === id);
  const movieReviews = state.reviews.filter(r => r.movieId === id);
  const isInWatchlist = user?.watchlist.includes(id || '') || false;

  if (!movie) {
    return <Navigate to="/404" replace />;
  }

  const toggleWatchlist = () => {
    if (!user || !id) return;
    
    if (isInWatchlist) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: id });
    }
  };

  const submitReview = () => {
    if (!user || !reviewText.trim() || reviewRating === 0) return;

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
  };

  const userHasReviewed = movieReviews.some(review => review.userId === user?.id);

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
                    <Button className="btn-gold" size="lg">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Trailer
                    </Button>
                  )}
                  
                  {user && (
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
                  )}
                  
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
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
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <Badge key={actor} variant="secondary" className="text-sm">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Reviews Section */}
              <Card className="card-gradient p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Reviews ({movieReviews.length})
                  </h2>
                  
                  {user && !userHasReviewed && (
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-cinema-purple hover:bg-cinema-purple/80"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Write Review
                    </Button>
                  )}
                </div>

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
                  {movieReviews.length > 0 ? (
                    movieReviews.map((review, index) => (
                      <div key={review.id}>
                        <ReviewCard review={review} />
                        {index < movieReviews.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet. Be the first to review this movie!
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

              {/* Related Movies */}
              <Card className="card-gradient p-6">
                <h3 className="text-xl font-bold mb-4">Similar Movies</h3>
                <div className="space-y-4">
                  {state.movies
                    .filter(m => 
                      m.id !== movie.id && 
                      m.genre.some(g => movie.genre.includes(g))
                    )
                    .slice(0, 3)
                    .map((similarMovie) => (
                      <div key={similarMovie.id} className="flex space-x-3">
                        <img
                          src={similarMovie.poster}
                          alt={similarMovie.title}
                          className="w-12 h-18 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-sm line-clamp-2">
                            {similarMovie.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {similarMovie.year}
                          </div>
                          <StarRating rating={similarMovie.avgRating} size="sm" />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetail;