import React, { useState } from 'react';
import { useLocale, type SupportedLocale } from '@enterprise/localization';

export interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { locale, setLocale } = useLocale();
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as SupportedLocale;
    if (nextLocale === locale || isChanging) return;

    setIsChanging(true);
    try {
      await setLocale(nextLocale);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={locale}
        onChange={handleChange}
        disabled={isChanging}
        aria-label="Select display language"
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
      >
        <option value="vi-VN">🇻🇳 Tiếng Việt</option>
        <option value="en-US">🇺🇸 English (US)</option>
      </select>
      {isChanging && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-blue-500 animate-spin">
          ⏳
        </span>
      )}
    </div>
  );
}
