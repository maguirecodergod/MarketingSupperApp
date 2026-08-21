import type { SupportedLocale } from './types.js';

export function normalizeLocale(input: string | null | undefined): SupportedLocale | null {
  if (!input || typeof input !== 'string') return null;

  const clean = input.trim().replace(/_/g, '-');
  if (!clean) return null;

  const lower = clean.toLowerCase();
  if (lower === 'vi' || lower === 'vi-vn' || lower.startsWith('vi-')) {
    return 'vi-VN';
  }
  if (lower === 'en' || lower === 'en-us' || lower.startsWith('en-')) {
    return 'en-US';
  }

  // Attempt canonical check
  if (typeof Intl !== 'undefined' && typeof Intl.getCanonicalLocales === 'function') {
    try {
      const canonicals = Intl.getCanonicalLocales(clean);
      for (const c of canonicals) {
        const cLower = c.toLowerCase();
        if (cLower.startsWith('vi')) return 'vi-VN';
        if (cLower.startsWith('en')) return 'en-US';
      }
    } catch {
      // Invalid BCP 47 tag
    }
  }

  return null;
}
