import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Star, Heart, Film, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/StarRating';
import MovieCard from '@/components/MovieCard';
import { useApp, useAuth } from '@/contexts/AppContext';

const Profile = () => {
  const { state } = useApp();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userReviews = state.reviews.filter(review => review.userId === user.id);
  const watchlistMovies = state.movies.filter(movie => user.watchlist.includes(movie.id));
  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
    : 0;

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <Card className="card-gradient mb-8">
          <div className="relative overflow-hidden rounded-t-lg">
            {/* Cover Background */}
            <div className="h-32 bg-gradient-to-r from-cinema-purple via-cinema-blue to-cinema-gold" />
            
            {/* Profile Info */}
            <div className="relative px-6 pb-6 -mt-16">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Avatar */}
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                  <AvatarImage src={user.profilePic} alt={user.username} />
                  <AvatarFallback className="text-3xl font-bold bg-cinema-purple text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {user.username}
                      </h1>
                      <p className="text-muted-foreground mb-3">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined {new Date(user.joinDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <Card className="p-4 text-center bg-secondary/30">
                  <div className="text-2xl font-bold text-cinema-gold mb-1">
                    {userReviews.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </Card>
                
                <Card className="p-4 text-center bg-secondary/30">
                  <div className="text-2xl font-bold text-cinema-gold mb-1">
                    {watchlistMovies.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Watchlist</div>
                </Card>
                
                <Card className="p-4 text-center bg-secondary/30">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-cinema-gold mr-2">
                      {averageRating.toFixed(1)}
                    </span>
                    <Star className="h-5 w-5 text-cinema-gold fill-current" />
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </Card>
                
                <Card className="p-4 text-center bg-secondary/30">
                  <div className="text-2xl font-bold text-cinema-gold mb-1">
                    {new Set(userReviews.flatMap(r => 
                      state.movies.find(m => m.id === r.movieId)?.genre || []
                    )).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Genres</div>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>My Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Watchlist</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Film className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Reviews ({userReviews.length})</h2>
            </div>

            {userReviews.length > 0 ? (
              <div className="space-y-6">
                {userReviews.map((review) => {
                  const movie = state.movies.find(m => m.id === review.movieId);
                  if (!movie) return null;

                  return (
                    <Card key={review.id} className="card-gradient p-6">
                      <div className="flex gap-6">
                        <Link to={`/movies/${movie.id}`} className="flex-shrink-0">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-20 h-30 object-cover rounded-lg hover:scale-105 transition-transform"
                          />
                        </Link>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Link 
                                to={`/movies/${movie.id}`}
                                className="text-xl font-bold text-foreground hover:text-cinema-gold transition-colors"
                              >
                                {movie.title}
                              </Link>
                              <div className="text-sm text-muted-foreground">
                                {movie.year} • {movie.director}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <StarRating rating={review.rating} size="sm" />
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(review.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground leading-relaxed mb-3">
                            {review.text}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {movie.genre.map((genre) => (
                              <Badge 
                                key={genre}
                                variant="secondary"
                                className="text-xs"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="card-gradient p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start reviewing movies to share your thoughts with the community.
                </p>
                <Button className="btn-gold" asChild>
                  <Link to="/movies">Browse Movies</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Watchlist ({watchlistMovies.length})</h2>
            </div>

            {watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {watchlistMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <Card className="card-gradient p-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Empty Watchlist</h3>
                <p className="text-muted-foreground mb-4">
                  Add movies to your watchlist to keep track of what you want to watch.
                </p>
                <Button className="btn-gold" asChild>
                  <Link to="/movies">Discover Movies</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            
            <div className="space-y-4">
              {userReviews
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((review) => {
                  const movie = state.movies.find(m => m.id === review.movieId);
                  if (!movie) return null;

                  return (
                    <Card key={review.id} className="card-gradient p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-cinema-gold rounded-full"></div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-foreground">
                            You reviewed{' '}
                            <Link 
                              to={`/movies/${movie.id}`}
                              className="font-semibold text-cinema-gold hover:text-cinema-gold/80"
                            >
                              {movie.title}
                            </Link>
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              
              {userReviews.length === 0 && (
                <Card className="card-gradient p-8 text-center">
                  <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Activity Yet</h3>
                  <p className="text-muted-foreground">
                    Your movie reviews and interactions will appear here.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;