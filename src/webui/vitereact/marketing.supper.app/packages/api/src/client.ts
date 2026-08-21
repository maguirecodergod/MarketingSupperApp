import type { components } from '@enterprise/api-contracts';
import { executeRequest, type RequestOptions } from './request.js';
import type { PaginationParams } from './pagination.js';

export type SessionResponse = components['schemas']['SessionResponse'];
export type DashboardSummary = components['schemas']['DashboardSummary'];
export type User = components['schemas']['User'];
export type UserProfile = components['schemas']['UserProfile'];
export type UserListResponse = components['schemas']['UserListResponse'];
export type UpdateMyProfileRequest = components['schemas']['UpdateMyProfileRequest'];
export type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
export type SessionListResponse = components['schemas']['SessionListResponse'];

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  // Base raw request
  request<T>(options: Omit<RequestOptions, 'baseUrl'>): Promise<T> {
    return executeRequest<T>({
      ...options,
      baseUrl: this.baseUrl,
    });
  }

  // Auth operations
  getCurrentSession(signal?: AbortSignal): Promise<SessionResponse> {
    return this.request<SessionResponse>({
      method: 'GET',
      path: '/auth/session',
      signal,
    });
  }

  logout(idempotencyKey?: string): Promise<void> {
    return this.request<void>({
      method: 'POST',
      path: '/auth/logout',
      idempotencyKey: idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined),
    });
  }

  // Dashboard operations
  getDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
    return this.request<DashboardSummary>({
      method: 'GET',
      path: '/dashboard/summary',
      signal,
    });
  }

  // Profile operations
  getMyProfile(signal?: AbortSignal): Promise<UserProfile> {
    return this.request<UserProfile>({
      method: 'GET',
      path: '/me/profile',
      signal,
      useETag: true,
    });
  }

  updateMyProfile(data: UpdateMyProfileRequest, ifMatch?: string, idempotencyKey?: string): Promise<UserProfile> {
    return this.request<UserProfile>({
      method: 'PATCH',
      path: '/me/profile',
      body: data,
      ifMatch,
      idempotencyKey: idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined),
    });
  }

  // Users operations
  listUsers(params?: PaginationParams, signal?: AbortSignal): Promise<UserListResponse> {
    return this.request<UserListResponse>({
      method: 'GET',
      path: '/users',
      query: params as Record<string, unknown>,
      signal,
    });
  }

  getUser(userId: string, signal?: AbortSignal): Promise<User> {
    return this.request<User>({
      method: 'GET',
      path: `/users/${userId}`,
      signal,
      useETag: true,
    });
  }

  updateUser(userId: string, data: UpdateUserRequest, ifMatch: string, idempotencyKey?: string): Promise<User> {
    return this.request<User>({
      method: 'PATCH',
      path: `/users/${userId}`,
      body: data,
      ifMatch,
      idempotencyKey: idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined),
    });
  }

  // Security Sessions
  listSecuritySessions(signal?: AbortSignal): Promise<SessionListResponse> {
    return this.request<SessionListResponse>({
      method: 'GET',
      path: '/security/sessions',
      signal,
    });
  }

  revokeSecuritySession(sessionId: string, idempotencyKey?: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      path: `/security/sessions/${sessionId}`,
      idempotencyKey: idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined),
    });
  }

  revokeOtherSecuritySessions(idempotencyKey?: string): Promise<void> {
    return this.request<void>({
      method: 'POST',
      path: '/security/sessions/revoke-others',
      idempotencyKey: idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined),
    });
  }
}

export const apiClient = new ApiClient();
