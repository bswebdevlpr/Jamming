import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFeedbackStore } from "@/app/stores/feedback";

describe("useFeedbackStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useFeedbackStore.setState({ submissions: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow submissions when under limit", () => {
    expect(useFeedbackStore.getState().canSubmit()).toBe(true);
  });

  it("should record a submission", () => {
    useFeedbackStore.getState().recordSubmission();
    expect(useFeedbackStore.getState().submissions.length).toBe(1);
  });

  it("should allow up to 3 submissions within cooldown", () => {
    useFeedbackStore.getState().recordSubmission();
    useFeedbackStore.getState().recordSubmission();
    expect(useFeedbackStore.getState().canSubmit()).toBe(true);
    useFeedbackStore.getState().recordSubmission();
    expect(useFeedbackStore.getState().canSubmit()).toBe(false);
  });

  it("should deny 4th submission within cooldown", () => {
    for (let i = 0; i < 3; i++) {
      useFeedbackStore.getState().recordSubmission();
    }
    expect(useFeedbackStore.getState().canSubmit()).toBe(false);
  });

  it("should allow submissions after cooldown expires", () => {
    for (let i = 0; i < 3; i++) {
      useFeedbackStore.getState().recordSubmission();
    }
    expect(useFeedbackStore.getState().canSubmit()).toBe(false);

    // Advance time by 1 hour + 1 second
    vi.advanceTimersByTime(60 * 60 * 1000 + 1000);
    expect(useFeedbackStore.getState().canSubmit()).toBe(true);
  });

  it("getCooldownRemaining should return 0 when can submit", () => {
    expect(useFeedbackStore.getState().getCooldownRemaining()).toBe(0);
  });

  it("getCooldownRemaining should return seconds when at limit", () => {
    for (let i = 0; i < 3; i++) {
      useFeedbackStore.getState().recordSubmission();
    }
    const remaining = useFeedbackStore.getState().getCooldownRemaining();
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(3600);
  });

  it("should clean up old submissions when recording new ones", () => {
    useFeedbackStore.getState().recordSubmission();
    vi.advanceTimersByTime(60 * 60 * 1000 + 1000); // 1h + 1s
    useFeedbackStore.getState().recordSubmission();
    // Old submission should be filtered out
    expect(useFeedbackStore.getState().submissions.length).toBe(1);
  });
});
