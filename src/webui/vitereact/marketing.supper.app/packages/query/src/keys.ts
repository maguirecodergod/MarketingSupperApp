import type { PaginationParams } from '@enterprise/api';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...queryKeys.dashboard.all, 'summary'] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => [...queryKeys.profile.all, 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: PaginationParams) => [...queryKeys.users.lists(), params ?? {}] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (userId: string) => [...queryKeys.users.details(), userId] as const,
  },
  security: {
    all: ['security'] as const,
    sessions: () => [...queryKeys.security.all, 'sessions'] as const,
  },
};
