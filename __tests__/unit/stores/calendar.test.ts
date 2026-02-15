import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useCalendarStore } from "@/app/stores/calendar";

describe("useCalendarStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useCalendarStore.setState({
      resetSlideCalendarDots: true,
      resetToToday: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should have correct initial state", () => {
    const state = useCalendarStore.getState();
    expect(state.resetSlideCalendarDots).toBe(true);
    expect(state.resetToToday).toBe(0);
  });

  it("setResetSlideCalendarDots should update value", () => {
    useCalendarStore.getState().setResetSlideCalendarDots(false);
    expect(useCalendarStore.getState().resetSlideCalendarDots).toBe(false);
  });

  it("triggerResetToToday should set to Date.now()", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    useCalendarStore.getState().triggerResetToToday();
    expect(useCalendarStore.getState().resetToToday).toBe(now);
  });
});
