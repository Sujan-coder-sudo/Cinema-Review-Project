// Custom hooks for API calls with loading states and error handling

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    onError?: (error: any) => void;
    onSuccess?: (data: T) => void;
  } = {}
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { immediate = true, onError, onSuccess } = options;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (variables?: any) => Promise<T | null>;
  reset: () => void;
}

export function useMutation<T>(
  apiCall: (variables?: any) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
  } = {}
): UseMutationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { onSuccess, onError, successMessage } = options;

  const mutate = useCallback(async (variables?: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(variables);
      setData(result);
      onSuccess?.(result);
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError, successMessage, toast]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// Hook for paginated data
export interface UsePaginatedApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalPages: number;
  currentPage: number;
}

export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<{
    data: T[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>,
  limit: number = 10,
  options: {
    immediate?: boolean;
    onError?: (error: any) => void;
  } = {}
): UsePaginatedApiState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const { immediate = true, onError } = options;

  const loadPage = useCallback(async (page: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(page, limit);
      
      if (append) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setHasMore(result.currentPage < result.totalPages);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiCall, limit, onError, toast]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPage(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadPage]);

  const refresh = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    loadPage(1, false);
  }, [loadPage]);

  useEffect(() => {
    if (immediate) {
      loadPage(1, false);
    }
  }, [immediate, loadPage]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalPages,
    currentPage,
  };
}

// Hook for optimistic updates
export function useOptimisticMutation<T, TVariables = any>(
  apiCall: (variables: TVariables) => Promise<T>,
  optimisticUpdate: (variables: TVariables, currentData: T | null) => T,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    rollbackOnError?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { onSuccess, onError, rollbackOnError = true } = options;

  const mutate = useCallback(async (variables: TVariables) => {
    const previousData = data;
    
    // Optimistic update
    const optimisticData = optimisticUpdate(variables, data);
    setData(optimisticData);
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(variables);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      // Rollback on error
      if (rollbackOnError && previousData) {
        setData(previousData);
      }
      
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, optimisticUpdate, data, onSuccess, onError, rollbackOnError, toast]);

  return {
    data,
    loading,
    error,
    mutate,
  };
}
