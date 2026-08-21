import { themeStorage } from './theme-storage.js';
import { getSystemTheme } from './system-theme.js';
import { resolveTheme } from './resolve-theme.js';
import { applyTheme } from './apply-theme.js';
import type { ResolvedTheme, ThemeMode } from './types.js';

export function bootstrapTheme(): { mode: ThemeMode; resolvedTheme: ResolvedTheme } {
  const mode = themeStorage.getPreference();
  const systemTheme = getSystemTheme();
  const resolved = resolveTheme(mode, systemTheme);
  applyTheme(resolved);
  return { mode, resolvedTheme: resolved };
}
