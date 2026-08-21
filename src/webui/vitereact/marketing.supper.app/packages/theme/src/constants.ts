import type { ThemeMode } from './types.js';

export const THEME_STORAGE_KEY = 'enterprise_theme_preference';
export const THEME_DATA_ATTRIBUTE = 'data-theme';
export const THEME_COLOR_SCHEME_ATTRIBUTE = 'color-scheme';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
export const DEFAULT_THEME_MODE: ThemeMode = 'system';
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'] as const;
export const THEME_BOOTSTRAP_VERSION = 1;
