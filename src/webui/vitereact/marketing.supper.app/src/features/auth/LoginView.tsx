import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Alert, LanguageSelector, ThemeToggle } from '@enterprise/ui';
import { useTranslation } from '@enterprise/localization';

export interface LoginViewProps {
  returnUrl?: string;
  onLoginSuccess?: () => void;
}

export function LoginView({ returnUrl = '/app/dashboard', onLoginSuccess }: LoginViewProps) {
  const { t } = useTranslation(['auth', 'common']);
  const [username, setUsername] = useState('admin_user');
  const [password, setPassword] = useState('EnterpriseAdmin@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      if (username.trim()) {
        onLoginSuccess?.();
      } else {
        setError(t('auth:invalidCredentials', 'Tên đăng nhập hoặc mật khẩu không chính xác'));
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
            E
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('auth:title', 'Cổng Quản Trị Doanh Nghiệp')}
          </CardTitle>
          <CardDescription>
            {t('auth:subtitle', 'Đăng nhập với tài khoản định danh bảo mật SSO')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive">{error}</Alert>}
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth:username', 'Tên đăng nhập')}
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="name@enterprise.internal"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth:password', 'Mật khẩu')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/40 p-3 text-xs text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900">
              {t('auth:demoAccountHint', 'Tài khoản mẫu: admin / admin123')}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" loading={loading}>
              {t('auth:signIn', 'Đăng nhập')}
            </Button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {returnUrl}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
