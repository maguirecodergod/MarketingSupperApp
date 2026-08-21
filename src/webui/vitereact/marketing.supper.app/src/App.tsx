import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@enterprise/query';
import { FeatureFlagProvider } from '@enterprise/feature-flags';
import { ThemeProvider } from '@enterprise/theme';
import { useTranslation } from '@enterprise/localization';
import { NavigationShell } from '@enterprise/ui';
import { RequirePermission, useSession } from '@enterprise/auth';
import { initObservability } from '@enterprise/observability';

import { LoginView } from './features/auth/LoginView.js';
import { DashboardView } from './features/dashboard/DashboardView.js';
import { UserListView } from './features/users/UserListView.js';
import { UserDetailView } from './features/users/UserDetailView.js';
import { ProfileView } from './features/settings/ProfileView.js';
import { SecuritySessionsView } from './features/settings/SecuritySessionsView.js';
import { PreferencesView } from './features/settings/PreferencesView.js';

export function AppContent() {
  const session = useSession();
  const { t } = useTranslation(['navigation', 'common']);
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/app/dashboard';
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    initObservability();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/app/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (href: string) => {
    window.history.pushState({}, '', href);
    setCurrentRoute(href);
    setSelectedUserId(null);
  };

  const navItems = [
    {
      label: t('navigation:dashboard', 'Tổng quan'),
      href: '/app/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      active: currentRoute === '/app/dashboard',
    },
    {
      label: t('navigation:users', 'Danh bạ người dùng'),
      href: '/app/users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      active: currentRoute.startsWith('/app/users'),
    },
    {
      label: t('navigation:profile', 'Hồ sơ của tôi'),
      href: '/app/settings/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      active: currentRoute === '/app/settings/profile',
    },
    {
      label: t('navigation:security', 'Phiên bảo mật'),
      href: '/app/settings/security',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      active: currentRoute === '/app/settings/security',
    },
    {
      label: t('navigation:preferences', 'Tùy chọn giao diện'),
      href: '/app/settings/preferences',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      active: currentRoute === '/app/settings/preferences',
    },
  ];

  if (currentRoute === '/auth/login') {
    return <LoginView onLoginSuccess={() => navigate('/app/dashboard')} />;
  }

  return (
    <NavigationShell
      appName={t('navigation:appName', 'Quản Trị Doanh Nghiệp')}
      headerTitle={t('navigation:appName', 'Quản Trị Doanh Nghiệp')}
      userName={session.user?.displayName || 'Administrator'}
      userEmail={session.user?.email || 'admin@enterprise.internal'}
      userRole={session.roles[0] || 'Administrator'}
      navItems={navItems}
      currentPath={currentRoute}
      onNavigate={navigate}
      onLogout={() => navigate('/auth/login')}
      signOutLabel={t('navigation:logout', 'Đăng xuất')}
    >
      {currentRoute === '/app/dashboard' && (
        <RequirePermission permission="dashboard.read">
          <DashboardView onNavigateToUsers={() => navigate('/app/users')} />
        </RequirePermission>
      )}

      {currentRoute.startsWith('/app/users') && (
        <RequirePermission permission="users.read">
          {selectedUserId ? (
            <UserDetailView
              userId={selectedUserId}
              onBack={() => setSelectedUserId(null)}
            />
          ) : (
            <UserListView onSelectUser={(id) => setSelectedUserId(id)} />
          )}
        </RequirePermission>
      )}

      {currentRoute === '/app/settings/profile' && (
        <RequirePermission permission="profile.read.self">
          <ProfileView />
        </RequirePermission>
      )}

      {currentRoute === '/app/settings/security' && (
        <RequirePermission permission="security.sessions.read.self">
          <SecuritySessionsView />
        </RequirePermission>
      )}

      {currentRoute === '/app/settings/preferences' && <PreferencesView />}
    </NavigationShell>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureFlagProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </FeatureFlagProvider>
    </QueryClientProvider>
  );
}

export default App;
