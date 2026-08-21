import { useQuery } from '@tanstack/react-query';
import { sessionQueryOptions } from '@enterprise/query';
import type { SessionResponse } from '@enterprise/api';

export interface AuthSession {
  isAuthenticated: boolean;
  user: SessionResponse['user'] | null;
  roles: string[];
  permissions: string[];
  expiresAt: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSession(): AuthSession {
  const { data, isLoading, error } = useQuery(sessionQueryOptions());

  if (isLoading) {
    return {
      isAuthenticated: false,
      user: null,
      roles: [],
      permissions: [],
      expiresAt: null,
      isLoading: true,
      error: null,
    };
  }

  if (error || !data || !data.authenticated) {
    return {
      isAuthenticated: false,
      user: null,
      roles: [],
      permissions: [],
      expiresAt: null,
      isLoading: false,
      error: error as Error | null,
    };
  }

  return {
    isAuthenticated: true,
    user: data.user,
    roles: data.roles,
    permissions: data.permissions,
    expiresAt: data.expiresAt,
    isLoading: false,
    error: null,
  };
}
