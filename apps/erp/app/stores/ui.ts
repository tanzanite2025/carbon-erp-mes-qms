import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UIStore {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  toggleSearchModal: () => void;
  isSidebarOpen: boolean;
  isSidebarPinned: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
  toggleSidebar: () => void;
  toggleSidebarPin: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSearchModalOpen: false,
      openSearchModal: () => set({ isSearchModalOpen: true }),
      closeSearchModal: () => set({ isSearchModalOpen: false }),
      toggleSearchModal: () =>
        set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
      isSidebarOpen: true,
      isSidebarPinned: false,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setSidebarPinned: (pinned) => set({ isSidebarPinned: pinned }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleSidebarPin: () =>
        set((state) => ({ isSidebarPinned: !state.isSidebarPinned }))
    }),
    {
      name: "carbon-ui-storage",
      storage: createJSONStorage(() => localStorage),
      // 只持久化侧边栏状态，不持久化搜索模态框状态
      partializeState: (state) => ({
        isSidebarPinned: state.isSidebarPinned
      })
    }
  )
);
