"use client";

import { create } from "zustand";

interface NotificationState {
  unreadCount: number;
  isLoading: boolean;
}

interface NotificationActions {
  setUnreadCount: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  decrementUnread: () => void;
  resetUnread: () => void;
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>((set) => ({
  unreadCount: 0,
  isLoading: true,

  setUnreadCount: (count) => set({ unreadCount: count, isLoading: false }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  decrementUnread: () =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  resetUnread: () => set({ unreadCount: 0 }),
}));
