"use client";

import { create } from "zustand";

const MAX_SUBMISSIONS = 3;
const COOLDOWN_MS = 60 * 60 * 1000; // 1시간

interface FeedbackState {
  submissions: number[];
}

interface FeedbackActions {
  canSubmit: () => boolean;
  recordSubmission: () => void;
  getCooldownRemaining: () => number;
}

export const useFeedbackStore = create<FeedbackState & FeedbackActions>(
  (set, get) => ({
    submissions: [],

    canSubmit: () => {
      const now = Date.now();
      const recent = get().submissions.filter((t) => now - t < COOLDOWN_MS);
      return recent.length < MAX_SUBMISSIONS;
    },

    recordSubmission: () => {
      const now = Date.now();
      set((state) => ({
        submissions: [
          ...state.submissions.filter((t) => now - t < COOLDOWN_MS),
          now,
        ],
      }));
    },

    getCooldownRemaining: () => {
      const now = Date.now();
      const recent = get().submissions.filter((t) => now - t < COOLDOWN_MS);
      if (recent.length < MAX_SUBMISSIONS) return 0;
      const oldest = Math.min(...recent);
      return Math.max(0, Math.ceil((COOLDOWN_MS - (now - oldest)) / 1000));
    },
  })
);
