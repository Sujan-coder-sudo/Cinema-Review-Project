import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Star, Heart, Film, Edit, Settings, Camera, Trash2, MoreVertical, TrendingUp, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import StarRating from '@/components/StarRating';
import MovieCard from '@/components/MovieCard';
import ReviewCard from '@/components/ReviewCard';
import { useApp, useAuth } from '@/contexts/AppContext';
import { Review, Movie } from '@/lib/mockData';

const Profile = () => {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: ''
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Simulate API calls
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const reviewsResponse = await fetch(`http://localhost:5000/api/users/${user.id}/reviews`);
        // const watchlistResponse = await fetch(`http://localhost:5000/api/users/${user.id}/watchlist`);
        
        // For now, use mock data
        const reviews = state.reviews.filter(review => review.userId === user.id);
        const watchlist = state.movies.filter(movie => user.watchlist.includes(movie.id));
        
        setUserReviews(reviews);
        setWatchlistMovies(watchlist);
        setEditForm({
          username: user.username,
          email: user.email,
          bio: '' // Add bio field to user model
        });
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id, state.reviews, state.movies, user.watchlist, user.username, user.email, toast]);

  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
    : 0;

  const handleEditProfile = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setShowEditProfile(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWatchlist = async (movieId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`http://localhost:5000/api/users/${user.id}/watchlist/${movieId}`, {
      //   method: 'DELETE'
      // });
      
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movieId });
      toast({
        title: "Removed from Watchlist",
        description: "Movie has been removed from your watchlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

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
                      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Username</label>
                              <Input
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Bio</label>
                              <Textarea
                                placeholder="Tell us about yourself..."
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleEditProfile} className="flex-1">
                                Save Changes
                              </Button>
                              <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
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
              <div className="space-y-4">
                {userReviews.map((review) => {
                  const movie = state.movies.find(m => m.id === review.movieId);
                  if (!movie) return null;

                  return (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      movie={movie}
                      showMovie={true}
                    />
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
                  <div key={movie.id} className="relative group">
                    <MovieCard movie={movie} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/80 backdrop-blur">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/movies/${movie.id}`} className="flex items-center">
                              <Film className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveFromWatchlist(movie.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove from Watchlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
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

// Loading Skeleton Component
const ProfileSkeleton = () => (
  <div className="min-h-screen pt-8 pb-16">
    <div className="container mx-auto px-4">
      {/* Profile Header Skeleton */}
      <Card className="mb-8">
        <div className="relative overflow-hidden rounded-t-lg">
          <Skeleton className="h-32 w-full" />
          
          <div className="relative px-6 pb-6 -mt-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4 text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-2" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-20" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Profile;