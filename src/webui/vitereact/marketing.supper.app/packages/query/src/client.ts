import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@enterprise/api';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          if (error instanceof ApiError) {
            if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 422) {
              return false;
            }
            return error.retryable && failureCount < 2;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        networkMode: 'online',
      },
      mutations: {
        retry: false,
        networkMode: 'online',
      },
    },
  });
}

export const queryClient = createQueryClient();
