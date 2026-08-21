import { themeStorage } from '../theme-storage.js';
import { DEFAULT_THEME_MODE } from '../constants.js';

export function testThemeStorage() {
  console.log('Testing theme storage...');

  // Mock localStorage
  const store: Record<string, string> = {};
  (globalThis as any).window = {
    localStorage: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
    },
  };

  // 1. Empty storage returns default
  if (themeStorage.getPreference() !== DEFAULT_THEME_MODE) {
    throw new Error('Default preference mismatch');
  }

  // 2. Setting valid mode
  themeStorage.setPreference('dark');
  if (themeStorage.getPreference() !== 'dark') {
    throw new Error('Expected dark preference');
  }

  // 3. Setting light mode
  themeStorage.setPreference('light');
  if (themeStorage.getPreference() !== 'light') {
    throw new Error('Expected light preference');
  }

  // 4. Invalid corrupted JSON returns default
  (globalThis as any).window.localStorage.setItem('enterprise_theme_preference', 'invalid-json{');
  if (themeStorage.getPreference() !== DEFAULT_THEME_MODE) {
    throw new Error('Corrupted storage should fallback to default');
  }

  console.log('✅ themeStorage tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('theme-store.test')) {
  testThemeStorage();
}
