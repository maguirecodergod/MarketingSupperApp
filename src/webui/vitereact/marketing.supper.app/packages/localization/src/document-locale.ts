import type { SupportedLocale } from './types.js';
import { getLocaleDirection } from './direction.js';

export function updateDocumentLocale(locale: SupportedLocale): void {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }

  const dir = getLocaleDirection(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
  document.documentElement.setAttribute('data-locale', locale);
}
