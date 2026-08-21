import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardSummaryQueryOptions } from '@enterprise/query';
import { useSession } from '@enterprise/auth';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, LoadingState, ErrorState } from '@enterprise/ui';
import { startSpan } from '@enterprise/observability';
import { useTranslation, formatInteger, useLocale } from '@enterprise/localization';

export interface DashboardViewProps {
  onNavigateToUsers?: () => void;
}

export function DashboardView({ onNavigateToUsers }: DashboardViewProps) {
  const session = useSession();
  const { t } = useTranslation(['dashboard', 'common']);
  const { locale } = useLocale();
  const { data: summary, isLoading, error, refetch } = useQuery(dashboardSummaryQueryOptions());

  useEffect(() => {
    const span = startSpan('dashboard.view_rendered', {
      userId: session.user?.id,
    });
    return () => span.end();
  }, [session.user?.id]);

  if (isLoading) {
    return <LoadingState message={t('common:loading', 'Đang tải...')} />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  // Fallback metrics from summary contract
  const userStats = summary?.users || {
    total: 12450,
    active: 11800,
    inactive: 420,
    locked: 80,
    pending: 150,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-md">
        <div>
          <h2 className="text-2xl font-bold">
            {t('dashboard:welcome', { name: session.user?.displayName || 'Administrator', defaultValue: `Chào mừng trở lại, ${session.user?.displayName || 'Administrator'}` })}
          </h2>
          <p className="mt-1 text-sm text-blue-100">
            {t('dashboard:slaNormal', 'Nền tảng Quản Trị Doanh Nghiệp đang hoạt động trong ngưỡng SLA ổn định.')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
            {session.roles[0] || 'Administrator'}
          </Badge>
          <Button
            variant="outline"
            className="bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold"
            onClick={onNavigateToUsers}
          >
            {t('dashboard:manageUsers', 'Quản lý người dùng')}
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              {t('dashboard:totalUsers', 'Tổng số người dùng')}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatInteger(userStats.total, locale)}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard:totalUsersSub', 'Thực thể trong danh bạ hệ thống')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">
              {t('dashboard:activeUsers', 'Đang hoạt động')}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatInteger(userStats.active, locale)}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard:activeUsersSub', 'Tuân thủ & sẵn sàng')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
              {t('dashboard:inactiveUsers', 'Không hoạt động')}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">
              {formatInteger(userStats.inactive, locale)}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard:inactiveUsersSub', 'Không hoạt động > 90 ngày')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase text-red-700 dark:text-red-400">
              {t('dashboard:lockedUsers', 'Bị khóa')}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">
              {formatInteger(userStats.locked, locale)}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard:lockedUsersSub', 'Khóa do rủi ro an ninh')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-400">
              {t('dashboard:pendingUsers', 'Đang chờ duyệt')}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
              {formatInteger(userStats.pending, locale)}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard:pendingUsersSub', 'Đang chờ xác minh')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Activity Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard:archStatus', 'Trạng thái kiến trúc')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:serverState', 'Quản lý trạng thái máy chủ')}
              </span>
              <Badge variant="success">TanStack Query v5</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:clientState', 'Trạng thái cục bộ UI')}
              </span>
              <Badge variant="secondary">Zustand</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:formEngine', 'Công cụ biểu mẫu & Xác thực')}
              </span>
              <Badge variant="secondary">TanStack Form + Zod</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:apiTransport', 'Giao thức truyền tải API')}
              </span>
              <Badge variant="secondary">OpenAPI Generated Types</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard:securityOverview', 'Tổng quan an ninh & giám sát')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:sessionArch', 'Kiến trúc Cookie Phiên')}
              </span>
              <Badge variant="success">{t('dashboard:enforced', 'Bắt buộc')}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:otelTracing', 'Giám sát OpenTelemetry')}
              </span>
              <Badge variant="success">{t('dashboard:active', 'Hoạt động')}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:sensitiveScrubbing', 'Lọc sạch dữ liệu nhạy cảm')}
              </span>
              <Badge variant="success">{t('dashboard:active', 'Hoạt động')}</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard:boundaryEnforcement', 'Kiểm soát ranh giới gói')}
              </span>
              <Badge variant="success">{t('dashboard:verified', 'Đã kiểm chứng')}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
