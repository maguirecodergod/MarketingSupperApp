import { queryOptions } from '@tanstack/react-query';
import { apiClient, type PaginationParams } from '@enterprise/api';
import { queryKeys } from './keys.js';

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.auth.session(),
    queryFn: ({ signal }) => apiClient.getCurrentSession(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

export const dashboardSummaryQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: ({ signal }) => apiClient.getDashboardSummary(signal),
  });

export const myProfileQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.profile.me(),
    queryFn: ({ signal }) => apiClient.getMyProfile(signal),
  });

export const userListQueryOptions = (params?: PaginationParams) =>
  queryOptions({
    queryKey: queryKeys.users.list(params),
    queryFn: ({ signal }) => apiClient.listUsers(params, signal),
  });

export const userDetailQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.users.detail(userId),
    queryFn: ({ signal }) => apiClient.getUser(userId, signal),
  });

export const securitySessionsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.security.sessions(),
    queryFn: ({ signal }) => apiClient.listSecuritySessions(signal),
  });
