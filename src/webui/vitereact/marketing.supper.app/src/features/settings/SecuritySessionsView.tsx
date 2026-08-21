import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  securitySessionsQueryOptions,
  useRevokeSessionMutation,
  useRevokeOtherSessionsMutation,
} from '@enterprise/query';
import { Card, CardContent, Badge, Button, Alert, LoadingState } from '@enterprise/ui';
import { useTranslation, formatDateTime, useLocale } from '@enterprise/localization';

export function SecuritySessionsView() {
  const { t } = useTranslation(['settings', 'common']);
  const { locale } = useLocale();
  const { data: sessionList, isLoading, refetch } = useQuery(securitySessionsQueryOptions());
  const revokeSessionMutation = useRevokeSessionMutation();
  const revokeOthersMutation = useRevokeOtherSessionsMutation();

  const [notification, setNotification] = useState<string | null>(null);

  // Fallback demo sessions
  const sessions = sessionList?.items || [
    {
      id: 'sess-current-01',
      device: 'Chrome 133 / macOS Sequoia',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      isCurrent: true,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'sess-remote-02',
      device: 'Safari / iPhone 16 Pro',
      ipAddress: '24.120.45.12',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X)',
      isCurrent: false,
      lastActiveAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'sess-remote-03',
      device: 'Firefox 135 / Ubuntu Linux',
      ipAddress: '172.56.21.90',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:135.0)',
      isCurrent: false,
      lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSessionMutation.mutateAsync({ sessionId });
      setNotification(t('settings:revokeSessionSuccess', 'Đã thu hồi phiên thành công.'));
      refetch();
    } catch {
      setNotification(t('settings:revokeFailure', 'Không thể thu hồi phiên.'));
    }
  };

  const handleRevokeOthers = async () => {
    try {
      await revokeOthersMutation.mutateAsync(undefined);
      setNotification(t('settings:revokeAllSuccess', 'Tất cả các phiên khác đã được thu hồi.'));
      refetch();
    } catch {
      setNotification(t('settings:revokeFailure', 'Không thể thu hồi phiên.'));
    }
  };

  if (isLoading) {
    return <LoadingState message={t('common:loading', 'Đang tải...')} />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('settings:securityTitle', 'Phiên Bảo Mật Đang Hoạt Động')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('settings:securitySubtitle', 'Theo dõi và thu hồi các phiên đăng nhập cũng như token thiết bị đang hoạt động.')}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRevokeOthers}
          loading={revokeOthersMutation.isPending}
        >
          {t('settings:revokeAllOthers', 'Thu hồi tất cả phiên khác')}
        </Button>
      </div>

      {notification && <Alert variant="success">{notification}</Alert>}

      <div className="space-y-4">
        {sessions.map((sess) => (
          <Card key={sess.id} className={sess.isCurrent ? 'border-blue-300 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/20' : ''}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{sess.device}</span>
                  {sess.isCurrent ? (
                    <Badge variant="success" className="text-[10px]">
                      {t('settings:currentSession', 'Phiên hiện tại')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      {t('settings:activeSession', 'Đang hoạt động')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{t('settings:ipAddress', { ip: sess.ipAddress, defaultValue: `IP: ${sess.ipAddress}` })}</span>
                  <span>{t('settings:lastActive', { time: formatDateTime(sess.lastActiveAt, locale), defaultValue: `Hoạt động lần cuối: ${formatDateTime(sess.lastActiveAt, locale)}` })}</span>
                </div>
              </div>
              <div>
                {!sess.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 h-8 text-xs"
                    onClick={() => handleRevoke(sess.id)}
                    loading={revokeSessionMutation.isPending}
                  >
                    {t('common:delete', 'Thu hồi')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
