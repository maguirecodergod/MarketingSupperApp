import React from 'react';
import { useSession } from './session.js';
import { hasPermission, type Permission } from './permissions.js';

export interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const session = useSession();

  if (session.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!session.isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

export interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({
  permission,
  children,
  fallback,
}: RequirePermissionProps) {
  const session = useSession();

  if (session.isLoading) {
    return null;
  }

  if (!hasPermission(session.permissions, permission)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-8 text-center bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-sm font-semibold text-amber-900">Permission Denied</h3>
        <p className="text-xs text-amber-700 mt-1">
          You lack the required permission (<code>{permission}</code>) to view this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
