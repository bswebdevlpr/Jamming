import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAction } from "@/app/lib/hooks/useAction";
import { ErrorCode } from "@/app/lib/errors/custom-error";
import type { ActionResult } from "@/app/lib/types/result";

describe("useAction", () => {
  it("should initialize with default state", () => {
    const action = vi.fn();
    const { result } = renderHook(() => useAction(action));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful action", async () => {
    const action = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1 },
    } as ActionResult<{ id: number }>);

    const { result } = renderHook(() => useAction(action));

    let data: any;
    await act(async () => {
      data = await result.current.execute();
    });

    expect(data).toEqual({ id: 1 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle failed action result", async () => {
    const action = vi.fn().mockResolvedValue({
      success: false,
      error: { code: ErrorCode.FORBIDDEN, message: "forbidden" },
    } as ActionResult<never>);

    const { result } = renderHook(() => useAction(action));

    let data: any;
    await act(async () => {
      data = await result.current.execute();
    });

    expect(data).toBeNull();
    expect(result.current.error).toEqual({
      code: ErrorCode.FORBIDDEN,
      message: "forbidden",
    });
  });

  it("should call onError callback on failure", async () => {
    const onError = vi.fn();
    const action = vi.fn().mockResolvedValue({
      success: false,
      error: { code: ErrorCode.FORBIDDEN, message: "no access" },
    } as ActionResult<never>);

    const { result } = renderHook(() => useAction(action, { onError }));

    await act(async () => {
      await result.current.execute();
    });

    expect(onError).toHaveBeenCalledWith({
      code: ErrorCode.FORBIDDEN,
      message: "no access",
    });
  });

  it("should handle network errors (thrown exceptions)", async () => {
    const action = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.code).toBe(ErrorCode.UNEXPECTED);
  });

  it("should set isLoading during execution", async () => {
    let resolveAction: Function;
    const action = vi.fn(
      () =>
        new Promise<ActionResult<string>>((resolve) => {
          resolveAction = resolve;
        })
    );

    const { result } = renderHook(() => useAction(action));

    let executePromise: Promise<any>;
    act(() => {
      executePromise = result.current.execute();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveAction!({ success: true, data: "done" });
      await executePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should clear error before each execution", async () => {
    const action = vi
      .fn()
      .mockResolvedValueOnce({
        success: false,
        error: { code: ErrorCode.FORBIDDEN, message: "err" },
      })
      .mockResolvedValueOnce({ success: true, data: "ok" });

    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).not.toBeNull();

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).toBeNull();
  });

  it("clearError should clear the error state", async () => {
    const action = vi.fn().mockResolvedValue({
      success: false,
      error: { code: ErrorCode.UNEXPECTED, message: "err" },
    });

    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it("should pass arguments to the action", async () => {
    const action = vi
      .fn()
      .mockResolvedValue({ success: true, data: true });

    const { result } = renderHook(() => useAction(action));

    await act(async () => {
      await result.current.execute("arg1", "arg2");
    });

    expect(action).toHaveBeenCalledWith("arg1", "arg2");
  });
});
