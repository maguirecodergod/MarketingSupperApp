import { LOCALE_STORAGE_KEY, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './constants.js';
import type { SupportedLocale } from './types.js';

export const localeStorage = {
  getPreference(): SupportedLocale | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const locale = typeof parsed === 'object' && parsed !== null ? parsed.locale : parsed;
      if (SUPPORTED_LOCALES.includes(locale)) {
        return locale;
      }
    } catch {
      // Ignore parse failure
    }
    return null;
  },

  setPreference(locale: SupportedLocale): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify({ locale, version: 1 }));
    } catch {
      // Ignore storage errors
    }
  },

  clearPreference(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};
