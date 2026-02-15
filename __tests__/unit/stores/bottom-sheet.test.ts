import { describe, it, expect, beforeEach } from "vitest";
import { useBottomSheetStore } from "@/app/stores/bottom-sheet";

describe("useBottomSheetStore", () => {
  beforeEach(() => {
    useBottomSheetStore.setState({
      children: null,
      location: null,
      header: false,
    });
  });

  it("should have correct initial state", () => {
    const state = useBottomSheetStore.getState();
    expect(state.children).toBeNull();
    expect(state.location).toBeNull();
    expect(state.header).toBe(false);
  });

  it("set should update partial state", () => {
    useBottomSheetStore.getState().set({
      location: "medium" as any,
      header: true,
    });
    const state = useBottomSheetStore.getState();
    expect(state.location).toBe("medium");
    expect(state.header).toBe(true);
  });

  it("setHeader should update header state", () => {
    useBottomSheetStore.getState().setHeader(true);
    expect(useBottomSheetStore.getState().header).toBe(true);
    useBottomSheetStore.getState().setHeader(false);
    expect(useBottomSheetStore.getState().header).toBe(false);
  });

  it("close should reset all state", () => {
    useBottomSheetStore.getState().set({
      location: "full" as any,
      header: true,
    });
    useBottomSheetStore.getState().close();
    const state = useBottomSheetStore.getState();
    expect(state.children).toBeNull();
    expect(state.location).toBeNull();
    expect(state.header).toBe(false);
  });
});
