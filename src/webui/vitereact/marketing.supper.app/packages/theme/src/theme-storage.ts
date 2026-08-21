import { THEME_STORAGE_KEY, DEFAULT_THEME_MODE, THEME_MODES } from './constants.js';
import type { ThemeMode } from './types.js';

export const themeStorage = {
  getPreference(): ThemeMode {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_THEME_MODE;
    }
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) return DEFAULT_THEME_MODE;
      const parsed = JSON.parse(stored);
      const mode = typeof parsed === 'object' && parsed !== null ? parsed.mode : parsed;
      if (THEME_MODES.includes(mode)) {
        return mode;
      }
    } catch {
      // Ignore malformed storage and fallback
    }
    return DEFAULT_THEME_MODE;
  },

  setPreference(mode: ThemeMode): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode, version: 1 }));
    } catch {
      // Ignore storage write errors (e.g. quota exceeded)
    }
  },
};
