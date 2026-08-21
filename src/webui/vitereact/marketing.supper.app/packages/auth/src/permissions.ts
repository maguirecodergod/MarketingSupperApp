export const Permissions = {
  DashboardRead: 'dashboard.read',
  ProfileReadSelf: 'profile.read.self',
  ProfileUpdateSelf: 'profile.update.self',
  UsersRead: 'users.read',
  UsersUpdate: 'users.update',
  SecuritySessionsReadSelf: 'security.sessions.read.self',
  SecuritySessionsRevokeSelf: 'security.sessions.revoke.self',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions] | string;

export function hasPermission(userPermissions: string[] | undefined, requiredPermission: Permission): boolean {
  if (!userPermissions) return false;
  if (userPermissions.includes('*') || userPermissions.includes('admin.*')) return true;
  return userPermissions.includes(requiredPermission);
}

export function hasAllPermissions(userPermissions: string[] | undefined, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every((p) => hasPermission(userPermissions, p));
}

export function hasAnyPermission(userPermissions: string[] | undefined, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some((p) => hasPermission(userPermissions, p));
}
