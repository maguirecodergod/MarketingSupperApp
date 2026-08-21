import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePreferencesStore } from '@enterprise/state';
import { selectThemeMode, selectSetThemeMode } from './selectors.js';
import { getSystemTheme, subscribeToSystemTheme } from './system-theme.js';
import { resolveTheme } from './resolve-theme.js';
import { applyTheme } from './apply-theme.js';
import { themeStorage } from './theme-storage.js';
import { startSpan } from '@enterprise/observability';
import type { ThemeMode, ResolvedTheme, ThemeContextValue } from './types.js';

export function useTheme(): ThemeContextValue {
  const mode = usePreferencesStore(selectThemeMode);
  const setStoreTheme = usePreferencesStore(selectSetThemeMode);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  useEffect(() => {
    // Only subscribe to matchMedia if mode is system
    if (mode === 'system') {
      const unsubscribe = subscribeToSystemTheme((newSysTheme) => {
        setSystemTheme(newSysTheme);
      });
      return unsubscribe;
    }
  }, [mode]);

  const resolvedTheme = useMemo(
    () => resolveTheme(mode, systemTheme),
    [mode, systemTheme]
  );

  // Apply DOM update whenever resolvedTheme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      const prevMode = mode;
      const newResolved = resolveTheme(newMode, systemTheme);
      themeStorage.setPreference(newMode);
      setStoreTheme(newMode);
      applyTheme(newResolved);

      const span = startSpan('theme_changed', {
        previous_mode: prevMode,
        next_mode: newMode,
        resolved_theme: newResolved,
      });
      span.end();
    },
    [mode, setStoreTheme, systemTheme]
  );

  const setLight = useCallback(() => setMode('light'), [setMode]);
  const setDark = useCallback(() => setMode('dark'), [setMode]);
  const setSystem = useCallback(() => setMode('system'), [setMode]);

  return {
    mode,
    resolvedTheme,
    setMode,
    setLight,
    setDark,
    setSystem,
    isSystem: mode === 'system',
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  };
}
