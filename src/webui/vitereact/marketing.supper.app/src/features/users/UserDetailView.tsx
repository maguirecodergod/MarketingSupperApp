import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userDetailQueryOptions } from '@enterprise/query';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, LoadingState } from '@enterprise/ui';
import { usePermissions } from '@enterprise/auth';
import { UserEditModal } from './UserEditModal.js';
import type { User } from '@enterprise/api';
import { useTranslation, formatDateTime, useLocale } from '@enterprise/localization';

export interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
}

export function UserDetailView({ userId, onBack }: UserDetailViewProps) {
  const { can } = usePermissions();
  const { t } = useTranslation(['users', 'common']);
  const { locale } = useLocale();
  const { data: user, isLoading, refetch } = useQuery(userDetailQueryOptions(userId));
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (isLoading) {
    return <LoadingState message={t('common:loading', 'Đang tải...')} />;
  }

  // Fallback demo user if not found in mock backend
  const displayUser: User = user || {
    id: userId,
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    email: 'john.doe@enterprise.internal',
    status: 'active',
    roles: ['admin', 'manager'],
    permissions: [
      'dashboard.read',
      'profile.read.self',
      'profile.update.self',
      'users.read',
      'users.update',
      'security.sessions.read.self',
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            {t('users:backToDirectory', '← Quay lại danh bạ')}
          </Button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{displayUser.displayName}</h2>
        </div>
        {can('users.update') && (
          <Button onClick={() => setEditingUser(displayUser)}>
            {t('users:editUser', 'Chỉnh sửa người dùng')}
          </Button>
        )}
      </div>

      {/* User Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-2xl font-bold text-blue-700 dark:text-blue-300">
              {displayUser.firstName.charAt(0)}
              {displayUser.lastName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{displayUser.displayName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{displayUser.email}</p>
            </div>
            <Badge
              variant={
                displayUser.status === 'active'
                  ? 'success'
                  : displayUser.status === 'locked'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {displayUser.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('users:accountDetails', 'Thông tin tài khoản')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('users:userId', 'Mã định danh (ID)')}</span>
                <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">{displayUser.id}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('users:username', 'Tên đăng nhập')}</span>
                <p className="font-medium text-gray-800 dark:text-gray-200">{displayUser.username}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('users:firstName', 'Tên')}</span>
                <p className="font-medium text-gray-800 dark:text-gray-200">{displayUser.firstName}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('users:lastName', 'Họ')}</span>
                <p className="font-medium text-gray-800 dark:text-gray-200">{displayUser.lastName}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('users:createdAt', 'Ngày tạo')}</span>
                <p className="text-gray-800 dark:text-gray-200">{formatDateTime(displayUser.createdAt, locale)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('users:lastUpdated', 'Cập nhật lần cuối')}</span>
                <p className="text-gray-800 dark:text-gray-200">{formatDateTime(displayUser.updatedAt, locale)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400 text-xs block mb-2">{t('users:assignedRoles', 'Vai trò được gán')}</span>
              <div className="flex flex-wrap gap-2">
                {displayUser.roles.map((r) => (
                  <Badge key={r} variant="secondary">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400 text-xs block mb-2">{t('users:effectivePermissions', 'Quyền hạn hiệu lực')}</span>
              <div className="flex flex-wrap gap-1.5">
                {displayUser.permissions.map((p) => (
                  <Badge key={p} variant="outline" className="font-mono text-[10px]">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
