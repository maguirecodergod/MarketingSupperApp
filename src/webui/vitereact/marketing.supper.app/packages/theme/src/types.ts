export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemePreference {
  mode: ThemeMode;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  setLight: () => void;
  setDark: () => void;
  setSystem: () => void;
  isSystem: boolean;
  isDark: boolean;
  isLight: boolean;
}
