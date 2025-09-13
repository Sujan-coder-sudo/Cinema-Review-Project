// Mock data for the movie review platform

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  year: number;
  director: string;
  cast: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  avgRating: number;
  duration: number;
  trailer?: string;
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  username: string;
  rating: number;
  text: string;
  timestamp: string;
  userAvatar?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
  joinDate: string;
  watchlist: string[];
}

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Interstellar',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    year: 2014,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop',
    avgRating: 4.8,
    duration: 169,
    trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    genre: ['Action', 'Crime', 'Drama'],
    year: 2008,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: 'https://images.unsplash.com/photo-1509347528160-9329d33b2588?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
    avgRating: 4.9,
    duration: 152
  },
  {
    id: '3',
    title: 'Inception',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    year: 2010,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'https://images.unsplash.com/photo-1489599735734-79b4fe286040?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
    avgRating: 4.7,
    duration: 148
  },
  {
    id: '4',
    title: 'Parasite',
    genre: ['Thriller', 'Drama', 'Comedy'],
    year: 2019,
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    synopsis: 'A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop',
    avgRating: 4.6,
    duration: 132
  },
  {
    id: '5',
    title: 'Dune',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    year: 2021,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'],
    synopsis: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    poster: 'https://images.unsplash.com/photo-1489599735734-79b4fe286040?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
    avgRating: 4.5,
    duration: 155
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    movieId: '1',
    username: 'CinemaLover',
    rating: 5,
    text: 'Absolutely mind-blowing! Nolan\'s masterpiece that combines stunning visuals with deep emotional storytelling.',
    timestamp: '2024-01-15T10:30:00Z',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    userId: '2',
    movieId: '1',
    username: 'SciFiFan92',
    rating: 4,
    text: 'Great science fiction concepts, though a bit long. The emotional core really works.',
    timestamp: '2024-01-10T15:45:00Z',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    userId: '1',
    movieId: '2',
    username: 'CinemaLover',
    rating: 5,
    text: 'Heath Ledger\'s Joker is legendary. This film redefined superhero movies.',
    timestamp: '2024-01-08T20:15:00Z',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

export const mockUser: User = {
  id: '1',
  username: 'CinemaLover',
  email: 'cinema@example.com',
  profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  joinDate: '2023-06-15',
  watchlist: ['2', '3', '5']
};

export const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance',
  'Sci-Fi', 'Thriller', 'War', 'Western'
];