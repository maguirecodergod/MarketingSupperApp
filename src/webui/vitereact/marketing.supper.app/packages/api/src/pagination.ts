import type { components } from '@enterprise/api-contracts';

export type UserListResponse = components['schemas']['UserListResponse'];

export interface PaginationParams {
  page?: number;
  pageSize?: 10 | 25 | 50 | 100;
  q?: string;
  status?: 'all' | 'active' | 'inactive' | 'locked' | 'pending';
  sortBy?: 'username' | 'displayName' | 'email' | 'status' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
}

export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
