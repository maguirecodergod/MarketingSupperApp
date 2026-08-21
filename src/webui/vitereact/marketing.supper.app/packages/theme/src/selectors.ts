import type { PreferencesState } from '@enterprise/state';
import type { ThemeMode } from './types.js';

export const selectThemeMode = (state: PreferencesState): ThemeMode => state.theme;
export const selectSetThemeMode = (state: PreferencesState): ((theme: ThemeMode) => void) => state.setTheme;
