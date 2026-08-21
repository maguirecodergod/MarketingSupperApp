import React from 'react';
import { usePreferencesStore } from '@enterprise/state';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, ThemeMenu, LanguageSelector } from '@enterprise/ui';
import { useTranslation } from '@enterprise/localization';

export function PreferencesView() {
  const { t } = useTranslation(['settings', 'common']);
  const { density, reducedMotion, setDensity, setReducedMotion } = usePreferencesStore();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t('settings:preferencesTitle', 'Tùy Chọn Giao Diện & Ngôn Ngữ')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('settings:preferencesSubtitle', 'Tùy biến chủ đề hiển thị, ngôn ngữ giao diện, mật độ bảng và chuyển động tiếp cận.')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings:appearanceSection', 'Giao diện & Mật độ')}</CardTitle>
          <CardDescription>
            {t('settings:appearanceDesc', 'Các cài đặt này được lưu trữ bền vững trong tùy chọn không gian làm việc của bạn.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings:themeMode', 'Chế độ giao diện')}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('settings:themeModeDesc', 'Chọn giao diện sáng, tối hoặc theo hệ điều hành')}
              </p>
            </div>
            <div>
              <ThemeMenu />
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings:languageLabel', 'Ngôn ngữ hệ thống')}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('settings:languageDesc', 'Chọn ngôn ngữ hiển thị giao diện người dùng')}
              </p>
            </div>
            <div>
              <LanguageSelector />
            </div>
          </div>

          {/* Grid Density */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings:densityLabel', 'Mật độ bảng dữ liệu')}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('settings:densityDesc', 'Khoảng cách dòng và độ thu gọn của bảng')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(['compact', 'comfortable'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    density === d
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {d === 'compact' ? t('settings:compact', 'Thu gọn') : t('settings:comfortable', 'Tiêu chuẩn')}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings:reducedMotionLabel', 'Giảm chuyển động')}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('settings:reducedMotionDesc', 'Tối thiểu hóa hiệu ứng động và cuộn mượt')}
              </p>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
