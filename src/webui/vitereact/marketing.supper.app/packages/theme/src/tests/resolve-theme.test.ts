import { resolveTheme } from '../resolve-theme.js';

export function testResolveTheme() {
  console.log('Testing resolveTheme...');
  
  // light mode always resolves to light
  if (resolveTheme('light', 'light') !== 'light') throw new Error('resolveTheme light+light failed');
  if (resolveTheme('light', 'dark') !== 'light') throw new Error('resolveTheme light+dark failed');

  // dark mode always resolves to dark
  if (resolveTheme('dark', 'light') !== 'dark') throw new Error('resolveTheme dark+light failed');
  if (resolveTheme('dark', 'dark') !== 'dark') throw new Error('resolveTheme dark+dark failed');

  // system mode follows system
  if (resolveTheme('system', 'light') !== 'light') throw new Error('resolveTheme system+light failed');
  if (resolveTheme('system', 'dark') !== 'dark') throw new Error('resolveTheme system+dark failed');

  console.log('✅ resolveTheme tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('resolve-theme.test')) {
  testResolveTheme();
}
