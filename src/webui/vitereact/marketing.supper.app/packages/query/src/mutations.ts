import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiClient,
  type UpdateMyProfileRequest,
  type UpdateUserRequest,
  type UserProfile,
  type User,
} from '@enterprise/api';
import { invalidationPolicies } from './invalidation.js';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfile,
    Error,
    { data: UpdateMyProfileRequest; ifMatch?: string; idempotencyKey?: string }
  >({
    mutationFn: ({ data, ifMatch, idempotencyKey }) =>
      apiClient.updateMyProfile(data, ifMatch, idempotencyKey),
    onSuccess: () => {
      invalidationPolicies.afterProfileUpdate(queryClient);
    },
  });
}

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    Error,
    { data: UpdateUserRequest; ifMatch: string; idempotencyKey?: string }
  >({
    mutationFn: ({ data, ifMatch, idempotencyKey }) =>
      apiClient.updateUser(userId, data, ifMatch, idempotencyKey),
    onSuccess: () => {
      invalidationPolicies.afterUserUpdate(queryClient, userId);
    },
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { sessionId: string; idempotencyKey?: string }>({
    mutationFn: ({ sessionId, idempotencyKey }) =>
      apiClient.revokeSecuritySession(sessionId, idempotencyKey),
    onSuccess: () => {
      invalidationPolicies.afterSessionRevoked(queryClient);
    },
  });
}

export function useRevokeOtherSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { idempotencyKey?: string } | undefined>({
    mutationFn: (params) => apiClient.revokeOtherSecuritySessions(params?.idempotencyKey),
    onSuccess: () => {
      invalidationPolicies.afterSessionRevoked(queryClient);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { idempotencyKey?: string } | undefined>({
    mutationFn: (params) => apiClient.logout(params?.idempotencyKey),
    onSuccess: () => {
      invalidationPolicies.afterLogout(queryClient);
    },
  });
}
