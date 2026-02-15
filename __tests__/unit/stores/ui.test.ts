import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/app/stores/ui";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      bodyWidth: 0,
      bodyHeight: 0,
      isSmallLoadingOn: false,
    });
  });

  it("should have correct initial state", () => {
    const state = useUIStore.getState();
    expect(state.bodyWidth).toBe(0);
    expect(state.bodyHeight).toBe(0);
    expect(state.isSmallLoadingOn).toBe(false);
  });

  it("setBodyDimensions should update width and height", () => {
    useUIStore.getState().setBodyDimensions(375, 812);
    const state = useUIStore.getState();
    expect(state.bodyWidth).toBe(375);
    expect(state.bodyHeight).toBe(812);
  });

  it("toggleSmallLoading should toggle loading state", () => {
    expect(useUIStore.getState().isSmallLoadingOn).toBe(false);
    useUIStore.getState().toggleSmallLoading();
    expect(useUIStore.getState().isSmallLoadingOn).toBe(true);
    useUIStore.getState().toggleSmallLoading();
    expect(useUIStore.getState().isSmallLoadingOn).toBe(false);
  });
});
