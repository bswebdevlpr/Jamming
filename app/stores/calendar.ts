"use client";

import { create } from "zustand";

interface CalendarState {
  resetSlideCalendarDots: boolean;
  resetToToday: number;
}

interface CalendarActions {
  setResetSlideCalendarDots: (value: boolean) => void;
  triggerResetToToday: () => void;
}

export const useCalendarStore = create<CalendarState & CalendarActions>(
  (set) => ({
    resetSlideCalendarDots: true,
    resetToToday: 0,

    setResetSlideCalendarDots: (value) => set({ resetSlideCalendarDots: value }),
    triggerResetToToday: () => set({ resetToToday: Date.now() }),
  })
);
