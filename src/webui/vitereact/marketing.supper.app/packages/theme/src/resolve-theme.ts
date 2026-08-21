import type { ThemeMode, ResolvedTheme } from './types.js';

export function resolveTheme(mode: ThemeMode, systemTheme: ResolvedTheme): ResolvedTheme {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  return systemTheme;
}
