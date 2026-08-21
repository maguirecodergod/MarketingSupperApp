import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys.js';

export const invalidationPolicies = {
  afterLogout: (queryClient: QueryClient) => {
    queryClient.clear();
  },
  afterProfileUpdate: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
  },
  afterUserUpdate: (queryClient: QueryClient, userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
  },
  afterSessionRevoked: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.security.sessions() });
  },
};
