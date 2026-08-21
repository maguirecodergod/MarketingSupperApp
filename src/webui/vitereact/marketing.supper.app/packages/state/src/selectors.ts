import { useUIStore } from './ui-store.js';
import { usePreferencesStore } from './preferences-store.js';
import { useAppStore } from './app-store.js';

export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useToggleSidebar = () => useUIStore((state) => state.toggleSidebar);
export const useTheme = () => usePreferencesStore((state) => state.theme);
export const useSetTheme = () => usePreferencesStore((state) => state.setTheme);
export const useDensity = () => usePreferencesStore((state) => state.density);
export const useSelectedGridRowIds = () => useAppStore((state) => state.selectedGridRowIds);
