import { useSession } from './session.js';
import { hasPermission, hasAllPermissions, hasAnyPermission, type Permission } from './permissions.js';
import { hasRole, type Role } from './roles.js';

export function usePermissions() {
  const { permissions, isLoading } = useSession();

  return {
    permissions,
    isLoading,
    can: (permission: Permission) => hasPermission(permissions, permission),
    canAll: (perms: Permission[]) => hasAllPermissions(permissions, perms),
    canAny: (perms: Permission[]) => hasAnyPermission(permissions, perms),
  };
}

export function useRoles() {
  const { roles, isLoading } = useSession();

  return {
    roles,
    isLoading,
    is: (role: Role) => hasRole(roles, role),
  };
}
