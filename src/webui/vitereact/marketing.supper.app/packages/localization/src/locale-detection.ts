import { DEFAULT_LOCALE } from './constants.js';
import { localeStorage } from './locale-storage.js';
import { normalizeLocale } from './locale-normalization.js';
import type { SupportedLocale } from './types.js';

export function detectLocale(): SupportedLocale {
  // 1. Persisted preference
  const persisted = localeStorage.getPreference();
  if (persisted) {
    return persisted;
  }

  // 2. Browser navigator.languages
  if (typeof navigator !== 'undefined') {
    const languages = navigator.languages || [navigator.language];
    for (const lang of languages) {
      const normalized = normalizeLocale(lang);
      if (normalized) {
        return normalized;
      }
    }
  }

  // 3. Default fallback
  return DEFAULT_LOCALE;
}
