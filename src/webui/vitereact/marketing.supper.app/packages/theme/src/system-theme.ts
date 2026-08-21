import { THEME_MEDIA_QUERY } from './constants.js';
import type { ResolvedTheme } from './types.js';

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  try {
    return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function subscribeToSystemTheme(listener: (theme: ResolvedTheme) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    listener(e.matches ? 'dark' : 'light');
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else if (typeof (mediaQuery as any).addListener === 'function') {
    (mediaQuery as any).addListener(handler);
    return () => (mediaQuery as any).removeListener(handler);
  }

  return () => {};
}
