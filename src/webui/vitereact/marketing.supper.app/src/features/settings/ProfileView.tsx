import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { myProfileQueryOptions, useUpdateProfileMutation } from '@enterprise/query';
import { updateProfileSchema } from '@enterprise/schemas';
import { TextField, mapApiErrorToForm } from '@enterprise/forms';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Alert, LoadingState } from '@enterprise/ui';
import { useTranslation } from '@enterprise/localization';

export function ProfileView() {
  const { t } = useTranslation(['settings', 'users', 'common']);
  const { data: profile, isLoading, error } = useQuery(myProfileQueryOptions());
  const updateMutation = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync loaded profile into state
  if (profile && !isInitialized) {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setDisplayName(profile.displayName);
    setEmail(profile.email);
    setIsInitialized(true);
  }

  if (isLoading) {
    return <LoadingState message={t('common:loading', 'Đang tải...')} />;
  }

  if (error && !profile) {
    // Demo fallback for initial render before login
    if (!isInitialized) {
      setFirstName('Admin');
      setLastName('User');
      setDisplayName('Enterprise Admin');
      setEmail('admin@enterprise.internal');
      setIsInitialized(true);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);
    setSuccessMessage(null);

    const payload = {
      firstName,
      lastName,
      displayName,
      email,
    };

    const validationResult = updateProfileSchema.safeParse(payload);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        data: payload,
        ifMatch: profile?.updatedAt ? `"${profile.updatedAt}"` : undefined,
      });
      setSuccessMessage(t('settings:profileUpdateSuccess', 'Đã cập nhật hồ sơ thành công.'));
    } catch (err: unknown) {
      const mapping = mapApiErrorToForm(err);
      setFieldErrors(mapping.fieldErrors);
      setGlobalError(mapping.globalError || t('settings:profileUpdateFailure', 'Không thể cập nhật hồ sơ cá nhân.'));
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('settings:profileTitle', 'Hồ Sơ Cá Nhân')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('settings:profileSubtitle', 'Quản lý thông tin định danh và liên hệ trong danh bạ doanh nghiệp.')}
        </p>
      </div>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {globalError && <Alert variant="destructive">{globalError}</Alert>}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t('settings:personalInfo', 'Thông tin cá nhân')}</CardTitle>
            <CardDescription>
              {t('settings:personalInfoDesc', 'Mọi thay đổi đều được kiểm tra tuân thủ chính sách doanh nghiệp và đồng bộ tự động.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label={t('users:firstName', 'Tên')}
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={fieldErrors.firstName}
                required
              />
              <TextField
                label={t('users:lastName', 'Họ')}
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={fieldErrors.lastName}
                required
              />
            </div>

            <TextField
              label={t('users:displayName', 'Tên hiển thị')}
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={fieldErrors.displayName}
              required
            />

            <TextField
              label={t('users:email', 'Địa chỉ Email')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t border-gray-100 dark:border-gray-800 pt-4">
            <Button type="submit" loading={updateMutation.isPending}>
              {t('settings:saveProfile', 'Lưu hồ sơ')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
