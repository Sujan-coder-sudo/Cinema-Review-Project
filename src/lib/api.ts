// API service layer for the Movie Review Platform
// Centralizes all API calls and provides consistent error handling

const API_BASE_URL = 'http://localhost:5000/api';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiClient.post<{ token: string }>('/auth/login', { email, password });
  },

  register: async (username: string, email: string, password: string) => {
    return apiClient.post<{ message: string; token: string }>('/auth/register', {
      username,
      email,
      password,
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async () => {
    return apiClient.get<{ user: any }>('/auth/me');
  },
};

// Movies API
export const moviesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    year?: number;
    rating?: number;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<{
      movies: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/movies${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiClient.get<any>(`/movies/${id}`);
  },

  getSimilar: async (id: string) => {
    return apiClient.get<any[]>(`/movies/${id}/similar`);
  },

  search: async (query: string, filters?: any) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return apiClient.get<{
      movies: any[];
      total: number;
    }>(`/movies/search?${queryParams.toString()}`);
  },

  getFavorites: async () => {
    return apiClient.get<any[]>('/movies/favorites');
  },

  addToFavorites: async (movieId: number) => {
    return apiClient.post('/movies/favorite', {
      movie_id: movieId,
      favorite: true,
    });
  },

  removeFromFavorites: async (movieId: number) => {
    return apiClient.post('/movies/favorite', {
      movie_id: movieId,
      favorite: false,
    });
  },
};

// Reviews API
export const reviewsApi = {
  getByMovie: async (movieId: string) => {
    return apiClient.get<any[]>(`/movies/${movieId}/reviews`);
  },

  create: async (movieId: string, rating: number, text: string) => {
    return apiClient.post<{ review: any }>(`/movies/${movieId}/reviews`, {
      rating,
      text,
    });
  },

  update: async (reviewId: string, rating: number, text: string) => {
    return apiClient.put<{ review: any }>(`/reviews/${reviewId}`, {
      rating,
      text,
    });
  },

  delete: async (reviewId: string) => {
    return apiClient.delete(`/reviews/${reviewId}`);
  },

  getUserReviews: async (userId: string) => {
    return apiClient.get<any[]>(`/users/${userId}/reviews`);
  },
};

// Users API
export const usersApi = {
  getProfile: async (userId: string) => {
    return apiClient.get<any>(`/users/${userId}`);
  },

  updateProfile: async (userId: string, data: {
    username?: string;
    email?: string;
    bio?: string;
  }) => {
    return apiClient.put<{ user: any }>(`/users/${userId}`, data);
  },

  getWatchlist: async (userId: string) => {
    return apiClient.get<any[]>(`/users/${userId}/watchlist`);
  },

  addToWatchlist: async (userId: string, movieId: string) => {
    return apiClient.post(`/users/${userId}/watchlist`, { movieId });
  },

  removeFromWatchlist: async (userId: string, movieId: string) => {
    return apiClient.delete(`/users/${userId}/watchlist/${movieId}`);
  },

  getActivity: async (userId: string) => {
    return apiClient.get<any[]>(`/users/${userId}/activity`);
  },
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Network status utilities
export const isOnline = () => navigator.onLine;

export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      resolve();
    };

    window.addEventListener('online', handleOnline);
  });
};

// Retry utility for failed requests
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

// Export default API client for custom requests
export default apiClient;
