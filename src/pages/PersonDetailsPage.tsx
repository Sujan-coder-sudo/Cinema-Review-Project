import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdbClient } from '@/lib/tmdb';
import { PersonDetails } from '@/types/tmdb';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Film, Calendar, MapPin, Info, User, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

type Credit = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  character?: string;
  job?: string;
  department?: string;
};

const PersonDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch person details with combined credits
        const data = await tmdbClient.request<PersonDetails>(`/person/${id}`, {
          append_to_response: 'combined_credits,external_ids',
        });

        setPerson(data);
      } catch (err) {
        console.error('Error fetching person details:', err);
        setError('Failed to load person details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  // -------------------------
  // PersonHero: background image only (no animation, no duplicated name)
  // -------------------------
  const PersonHero: React.FC<{ person: PersonDetails }> = ({ person }) => {
    const backgroundImage = person?.profile_path
      ? `https://image.tmdb.org/t/p/original${person.profile_path}`
      : undefined;

    return (
      <div
        className="relative h-56 md:h-80 overflow-hidden rounded-md"
        aria-hidden
      >
        {/* Background (image if available, otherwise gradient) */}
        {backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center transform-gpu"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              filter: 'brightness(0.35) saturate(0.9) contrast(0.95)',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700" />
        )}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="w-full aspect-[2/3]" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="lg:col-span-9 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[2/3]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort credits
  const actingCredits = person?.combined_credits?.cast || [];
  const directingCredits =
    person?.combined_credits?.crew?.filter((credit) => credit.department === 'Directing' && credit.job === 'Director') ||
    [];
  const productionCredits =
    person?.combined_credits?.crew?.filter((credit) => credit.department === 'Production' && credit.job === 'Producer') || [];

  // Sort by release date (newest first)
  const sortByDate = (a: any, b: any) => {
    const dateA = a.release_date || a.first_air_date || '';
    const dateB = b.release_date || b.first_air_date || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  };

  const FilmGrid = ({ credits }: { credits: any[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {credits.sort(sortByDate).map((credit) => (
        <Link
          key={`${credit.media_type}-${credit.id}`}
          to={`/${credit.media_type === 'movie' ? 'movies' : 'tv'}/${credit.id}`}
          className="group"
        >
          <div className="bg-card/40 border border-white/10 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
            <div className="relative aspect-[2/3] bg-muted/20">
              {credit.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
                  alt={credit.title || credit.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-cinema-gold/90 text-black text-xs font-bold px-2 py-1 rounded">
                {credit.vote_average ? credit.vote_average.toFixed(1) : 'N/A'}
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-white truncate group-hover:text-cinema-gold transition-colors">
                {credit.title || credit.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{credit.media_type === 'movie' ? 'Movie' : 'TV'}</span>
                <span>
                  {credit.release_date || credit.first_air_date
                    ? new Date(credit.release_date || credit.first_air_date).getFullYear()
                    : 'N/A'}
                </span>
              </div>
              {credit.character && (
                <p className="text-xs text-muted-foreground truncate mt-1">as {credit.character}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  // Known For: pick top credits by popularity/vote_count
  const knownFor = [...actingCredits, ...directingCredits, ...productionCredits]
    .filter((c) => c.media_type === 'movie' || c.media_type === 'tv')
    .sort((a: any, b: any) => {
      const aScore = (a.popularity || 0) + (a.vote_count || 0) / 1000 + (a.vote_average || 0);
      const bScore = (b.popularity || 0) + (b.vote_count || 0) / 1000 + (b.vote_average || 0);
      return bScore - aScore;
    })
    .slice(0, 8);

  if (error || !person) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Person Not Found</h2>
          <p className="text-gray-300 mb-6">{error || 'The person you are looking for does not exist.'}</p>
          <Button asChild variant="outline">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Final render
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Hero */}
      {person && <PersonHero person={person} />}

      <div className="container mx-auto px-4 pb-10 -mt-20 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <Card className="bg-card/60 border-white/10">
                <CardContent className="p-0">
                  <div className="w-full aspect-[2/3] bg-muted/20">
                    {person?.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold leading-tight">{person?.name}</h1>
                      {person?.known_for_department && (
                        <p className="text-sm text-muted-foreground mt-1">{person.known_for_department}</p>
                      )}
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-2 text-sm">
                      {person?.birthday && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(person.birthday), 'MMMM d, yyyy')}
                            {person?.deathday && ` - ${format(new Date(person.deathday), 'MMMM d, yyyy')}`}
                          </span>
                        </div>
                      )}
                      {person?.place_of_birth && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{person.place_of_birth}</span>
                        </div>
                      )}
                    </div>

                    {/* External Links if available */}
                    {person?.external_ids && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {person.external_ids.imdb_id && (
                          <a
                            href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                          >
                            <ExternalLink className="h-3 w-3" /> IMDB
                          </a>
                        )}
                        {person.homepage && (
                          <a
                            href={person.homepage}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition"
                          >
                            <LinkIcon className="h-3 w-3" /> Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Known For */}
            {knownFor.length > 0 && (
              <Card className="bg-card/60 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Film className="h-5 w-5 text-cinema-gold" />
                    <h2 className="text-xl font-semibold">Known For</h2>
                  </div>
                  <FilmGrid credits={knownFor} />
                </CardContent>
              </Card>
            )}

            {/* Biography */}
            {person?.biography && (
              <Card className="bg-card/60 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-cinema-gold" />
                    <h2 className="text-xl font-semibold">Biography</h2>
                  </div>
                  <p className={`text-muted-foreground leading-relaxed ${!bioExpanded ? 'line-clamp-6' : ''}`}>
                    {person.biography}
                  </p>
                  <div className="mt-3">
                    <Button variant="ghost" size="sm" onClick={() => setBioExpanded((v) => !v)} className="px-2">
                      {bioExpanded ? 'Show less' : 'Read more'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filmography Tabs */}
            <Card className="bg-card/60 border-white/10">
              <CardContent className="p-0">
                <Tabs defaultValue={actingCredits.length ? 'acting' : directingCredits.length ? 'directing' : 'production'}>
                  <div className="px-4 pt-4">
                    <TabsList>
                      <TabsTrigger value="acting">Acting ({actingCredits.length})</TabsTrigger>
                      <TabsTrigger value="directing">Directing ({directingCredits.length})</TabsTrigger>
                      <TabsTrigger value="production">Production ({productionCredits.length})</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-4 space-y-6">
                    <TabsContent value="acting" className="m-0">
                      {actingCredits.length ? (
                        <FilmGrid credits={actingCredits} />
                      ) : (
                        <p className="text-sm text-muted-foreground">No acting credits available.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="directing" className="m-0">
                      {directingCredits.length ? (
                        <FilmGrid credits={directingCredits} />
                      ) : (
                        <p className="text-sm text-muted-foreground">No directing credits available.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="production" className="m-0">
                      {productionCredits.length ? (
                        <FilmGrid credits={productionCredits} />
                      ) : (
                        <p className="text-sm text-muted-foreground">No production credits available.</p>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailsPage;
