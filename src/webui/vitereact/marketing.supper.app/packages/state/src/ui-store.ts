import { create } from 'zustand';
import { statePersistence } from './storage.js';

export interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: statePersistence.get<boolean>('sidebar_open', true),
  commandPaletteOpen: false,
  activeModal: null,

  toggleSidebar: () =>
    set((state) => {
      const next = !state.sidebarOpen;
      statePersistence.set('sidebar_open', next);
      return { sidebarOpen: next };
    }),

  setSidebarOpen: (open) => {
    statePersistence.set('sidebar_open', open);
    set({ sidebarOpen: open });
  },

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
