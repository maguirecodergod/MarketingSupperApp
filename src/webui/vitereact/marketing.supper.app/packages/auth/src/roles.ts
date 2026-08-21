export const Roles = {
  SuperAdmin: 'super_admin',
  Admin: 'admin',
  Manager: 'manager',
  Viewer: 'viewer',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles] | string;

export function hasRole(userRoles: string[] | undefined, requiredRole: Role): boolean {
  if (!userRoles) return false;
  return userRoles.includes(requiredRole);
}
