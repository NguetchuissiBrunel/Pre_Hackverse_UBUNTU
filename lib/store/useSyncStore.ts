import { create } from 'zustand';

interface SyncStore {
  isSyncing: boolean;
  setSyncing: (val: boolean) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  isSyncing: false,
  setSyncing: (val) => set({ isSyncing: val }),
}));
