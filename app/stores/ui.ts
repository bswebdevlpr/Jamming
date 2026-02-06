"use client";

import { create } from "zustand";

interface UIState {
  bodyWidth: number;
  bodyHeight: number;
  isSmallLoadingOn: boolean;
}

interface UIActions {
  setBodyDimensions: (width: number, height: number) => void;
  toggleSmallLoading: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  bodyWidth: 0,
  bodyHeight: 0,
  isSmallLoadingOn: false,

  setBodyDimensions: (width, height) =>
    set({ bodyWidth: width, bodyHeight: height }),
  toggleSmallLoading: () =>
    set((state) => ({ isSmallLoadingOn: !state.isSmallLoadingOn })),
}));
