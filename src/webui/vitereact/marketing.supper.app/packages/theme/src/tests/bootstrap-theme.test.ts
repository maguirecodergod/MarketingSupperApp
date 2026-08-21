import { bootstrapTheme } from '../bootstrap-theme.js';
import { THEME_STORAGE_KEY } from '../constants.js';

export function testBootstrapTheme() {
  console.log('Testing bootstrapTheme...');

  const store: Record<string, string> = {};
  const classListSet = new Set<string>();
  const attributes: Record<string, string> = {};

  (globalThis as any).window = {
    localStorage: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
    },
    matchMedia: () => ({ matches: false }),
  };

  (globalThis as any).document = {
    documentElement: {
      classList: {
        add: (c: string) => classListSet.add(c),
        remove: (c: string) => classListSet.delete(c),
        contains: (c: string) => classListSet.has(c),
      },
      setAttribute: (k: string, v: string) => { attributes[k] = v; },
      style: {},
    },
  };

  // Case 1: System theme with light OS
  const result = bootstrapTheme();
  if (result.mode !== 'system' || result.resolvedTheme !== 'light') {
    throw new Error('Default bootstrap failed');
  }

  // Case 2: Persisted dark theme
  store[THEME_STORAGE_KEY] = JSON.stringify({ mode: 'dark' });
  const resultDark = bootstrapTheme();
  if (resultDark.mode !== 'dark' || resultDark.resolvedTheme !== 'dark') {
    throw new Error('Dark bootstrap failed');
  }
  if (!classListSet.has('dark')) throw new Error('Dark class missing after bootstrap');

  console.log('✅ bootstrapTheme tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('bootstrap-theme.test')) {
  testBootstrapTheme();
}
