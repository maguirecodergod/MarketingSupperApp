import { create } from 'zustand';
import { statePersistence } from './storage.js';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SupportedLocale = 'vi-VN' | 'en-US';

export interface PreferencesState {
  theme: ThemeMode;
  locale: SupportedLocale;
  density: 'compact' | 'comfortable';
  reducedMotion: boolean;
  setTheme: (theme: ThemeMode) => void;
  setLocale: (locale: SupportedLocale) => void;
  setDensity: (density: 'compact' | 'comfortable') => void;
  setReducedMotion: (reducedMotion: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  theme: statePersistence.get<ThemeMode>('theme', 'system'),
  locale: statePersistence.get<SupportedLocale>('locale', 'vi-VN'),
  density: statePersistence.get<'compact' | 'comfortable'>('density', 'comfortable'),
  reducedMotion: statePersistence.get<boolean>('reducedMotion', false),

  setTheme: (theme) => {
    statePersistence.set('theme', theme);
    set({ theme });
  },
  setLocale: (locale) => {
    statePersistence.set('locale', locale);
    set({ locale });
  },
  setDensity: (density) => {
    statePersistence.set('density', density);
    set({ density });
  },
  setReducedMotion: (reducedMotion) => {
    statePersistence.set('reducedMotion', reducedMotion);
    set({ reducedMotion });
  },
}));
