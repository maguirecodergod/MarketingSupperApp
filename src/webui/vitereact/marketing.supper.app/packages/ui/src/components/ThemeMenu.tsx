import React from 'react';
import { useTheme } from '@enterprise/theme';

export interface ThemeMenuProps {
  className?: string;
}

export function ThemeMenu({ className = '' }: ThemeMenuProps) {
  const { mode, setMode } = useTheme();

  return (
    <div className={`inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 ${className}`}>
      {(['light', 'dark', 'system'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setMode(t)}
          aria-pressed={mode === t}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
            mode === t
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
