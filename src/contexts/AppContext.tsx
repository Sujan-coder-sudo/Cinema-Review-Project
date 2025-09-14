import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Movie, Review, User, mockMovies, mockReviews, mockUser } from '@/lib/mockData';

interface AppState {
  movies: Movie[];
  reviews: Review[];
  user: User | null;
  searchQuery: string;
  selectedGenres: string[];
  isAuthenticated: boolean;
  loading: boolean;
}

type AppAction = 
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_GENRES'; payload: string[] }
  | { type: 'TOGGLE_GENRE'; payload: string }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_WATCHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  movies: mockMovies,
  reviews: mockReviews,
  user: null,
  searchQuery: '',
  selectedGenres: [],
  isAuthenticated: false,
  loading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, action.payload] };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_GENRES':
      return { ...state, selectedGenres: action.payload };
    case 'TOGGLE_GENRE':
      const genre = action.payload;
      const isSelected = state.selectedGenres.includes(genre);
      return {
        ...state,
        selectedGenres: isSelected
          ? state.selectedGenres.filter(g => g !== genre)
          : [...state.selectedGenres, genre]
      };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'ADD_TO_WATCHLIST':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          watchlist: [...state.user.watchlist, action.payload]
        }
      };
    case 'REMOVE_FROM_WATCHLIST':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          watchlist: state.user.watchlist.filter(id => id !== action.payload)
        }
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Auth helper functions
export const useAuth = () => {
  const { state, dispatch } = useApp();

  const login = (email: string, password: string) => {
    // Create a user object from the email (in a real app, you might fetch user details from API)
    const user: User = {
      id: Date.now().toString(),
      username: email.split('@')[0], // Use email prefix as username
      email,
      joinDate: new Date().toISOString(),
      watchlist: []
    };
    dispatch({ type: 'LOGIN', payload: user });
    return true;
  };

  const register = (username: string, email: string, password: string) => {
    // Create a new user object
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      joinDate: new Date().toISOString(),
      watchlist: []
    };
    dispatch({ type: 'LOGIN', payload: newUser });
    return true;
  };

  const logout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  // Check if user is authenticated on app load
  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (token && !state.isAuthenticated) {
      // You might want to verify the token with the backend here
      // For now, we'll assume the token is valid
      dispatch({ type: 'SET_LOADING', payload: true });
      // Could decode JWT token to get user info, but for simplicity, 
      // we'll create a placeholder user
      const user: User = {
        id: 'authenticated',
        username: 'User',
        email: 'user@example.com',
        joinDate: new Date().toISOString(),
        watchlist: []
      };
      dispatch({ type: 'LOGIN', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus
  };
};