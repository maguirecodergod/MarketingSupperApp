import { getSystemTheme, subscribeToSystemTheme } from '../system-theme.js';

export function testSystemTheme() {
  console.log('Testing systemTheme...');

  let changeHandler: ((e: any) => void) | null = null;
  (globalThis as any).window = {
    matchMedia: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: (type: string, listener: any) => {
        if (type === 'change') changeHandler = listener;
      },
      removeEventListener: (type: string, listener: any) => {
        if (type === 'change' && changeHandler === listener) changeHandler = null;
      },
    }),
  };

  if (getSystemTheme() !== 'light') throw new Error('getSystemTheme expected light');

  let notifiedTheme: string | null = null;
  const unsubscribe = subscribeToSystemTheme((t) => {
    notifiedTheme = t;
  });

  if (typeof changeHandler === 'function') {
    (changeHandler as any)({ matches: true });
    if (notifiedTheme !== 'dark') throw new Error('Subscription notification failed for dark');
  }

  unsubscribe();
  if (changeHandler !== null) throw new Error('Unsubscribe did not remove change listener');

  console.log('✅ systemTheme tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('system-theme.test')) {
  testSystemTheme();
}
