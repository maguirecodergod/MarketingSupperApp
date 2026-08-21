import { create } from 'zustand';

export interface AppState {
  globalLoading: boolean;
  selectedGridRowIds: Record<string, boolean>;
  setGlobalLoading: (loading: boolean) => void;
  toggleRowSelection: (rowId: string) => void;
  selectAllRows: (rowIds: string[]) => void;
  clearRowSelection: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  globalLoading: false,
  selectedGridRowIds: {},

  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  toggleRowSelection: (rowId) =>
    set((state) => {
      const next = { ...state.selectedGridRowIds };
      if (next[rowId]) {
        delete next[rowId];
      } else {
        next[rowId] = true;
      }
      return { selectedGridRowIds: next };
    }),

  selectAllRows: (rowIds) =>
    set(() => {
      const next: Record<string, boolean> = {};
      for (const id of rowIds) {
        next[id] = true;
      }
      return { selectedGridRowIds: next };
    }),

  clearRowSelection: () => set({ selectedGridRowIds: {} }),
}));
