import React, { useState } from 'react';
import type { User } from '@enterprise/api';
import { useUpdateUserMutation } from '@enterprise/query';
import { updateUserSchema } from '@enterprise/schemas';
import { TextField, SelectField, mapApiErrorToForm } from '@enterprise/forms';
import { Button, Alert } from '@enterprise/ui';
import { useTranslation } from '@enterprise/localization';

export interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export function UserEditModal({ user, isOpen, onClose, onSuccess }: UserEditModalProps) {
  const { t } = useTranslation(['users', 'common', 'forms', 'validation']);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState<User['status']>(user.status);
  const [role, setRole] = useState(user.roles[0] || 'viewer');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const updateMutation = useUpdateUserMutation(user.id);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    const payload = {
      firstName,
      lastName,
      displayName,
      email,
      status,
      roles: [role],
    };

    // Client-side schema validation using Zod
    const validationResult = updateUserSchema.safeParse(payload);
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
      // Execute mutation passing payload and concurrency If-Match ETag
      const result = await updateMutation.mutateAsync({
        data: payload,
        ifMatch: `"${user.updatedAt}"`,
      });
      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      const mapping = mapApiErrorToForm(err);
      setFieldErrors(mapping.fieldErrors);
      setGlobalError(mapping.globalError || t('users:updateFailure', 'Không thể cập nhật người dùng.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('users:editUserTitle', 'Cập nhật thông tin người dùng')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md p-1 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {globalError && <Alert variant="destructive">{globalError}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label={t('users:accountStatus', 'Trạng thái tài khoản')}
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as User['status'])}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Locked', value: 'locked' },
                { label: 'Pending', value: 'pending' },
              ]}
              error={fieldErrors.status}
            />

            <SelectField
              label={t('users:primaryRole', 'Vai trò chính')}
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Administrator', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'Viewer', value: 'viewer' },
              ]}
              error={fieldErrors.roles}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              {t('common:cancel', 'Hủy bỏ')}
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              {t('users:saveChanges', 'Lưu thay đổi')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
