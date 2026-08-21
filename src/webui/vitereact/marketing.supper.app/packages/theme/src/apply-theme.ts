import { THEME_DATA_ATTRIBUTE } from './constants.js';
import type { ResolvedTheme } from './types.js';

export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }

  const root = document.documentElement;
  const oppositeTheme: ResolvedTheme = theme === 'dark' ? 'light' : 'dark';

  root.classList.remove(oppositeTheme);
  root.classList.add(theme);
  root.setAttribute(THEME_DATA_ATTRIBUTE, theme);
  root.style.colorScheme = theme;
}
