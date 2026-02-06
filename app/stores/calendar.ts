"use client";

import { create } from "zustand";

interface CalendarState {
  resetSlideCalendarDots: boolean;
}

interface CalendarActions {
  setResetSlideCalendarDots: (value: boolean) => void;
}

export const useCalendarStore = create<CalendarState & CalendarActions>(
  (set) => ({
    resetSlideCalendarDots: true,

    setResetSlideCalendarDots: (value) => set({ resetSlideCalendarDots: value }),
  })
);
