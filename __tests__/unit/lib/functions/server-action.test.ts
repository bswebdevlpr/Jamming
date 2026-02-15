import { describe, it, expect, vi, beforeEach } from "vitest";
import { safeAction } from "@/app/lib/functions/server-action";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { ok, fail, isError } from "@/app/lib/types/result";

// Mock logger
vi.mock("@/app/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe("safeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return ok result on successful execution", async () => {
    const result = await safeAction("test", async () => "hello");
    expect(result).toEqual({ success: true, data: "hello" });
  });

  it("should return ok with complex data", async () => {
    const data = { id: 1, name: "test" };
    const result = await safeAction("test", async () => data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it("should return fail result on CustomError", async () => {
    const result = await safeAction("test", async () => {
      throw CustomError.forbidden({ operation: "test" });
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe(ErrorCode.FORBIDDEN);
      expect(result.error.message).toBe("권한이 없습니다.");
    }
  });

  it("should return UNEXPECTED for non-CustomError", async () => {
    const result = await safeAction("test", async () => {
      throw new Error("random error");
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe(ErrorCode.UNEXPECTED);
    }
  });

  it("should log errors", async () => {
    const { logger } = await import("@/app/lib/logger");
    await safeAction("testOp", async () => {
      throw new Error("err");
    });
    expect(logger.error).toHaveBeenCalledWith("testOp", expect.any(Error));
  });

  it("should preserve CustomError code and message", async () => {
    const result = await safeAction("test", async () => {
      throw CustomError.bandLimitReached({ operation: "createBand" });
    });
    if (!result.success) {
      expect(result.error.code).toBe(ErrorCode.BAND_LIMIT_REACHED);
      expect(result.error.message).toBe(
        "밴드 생성/참여 한도에 도달했습니다."
      );
    }
  });

  it("should return ok(true) for boolean operations", async () => {
    const result = await safeAction("test", async () => true);
    expect(result).toEqual({ success: true, data: true });
  });

  it("should handle async operations with delay", async () => {
    const result = await safeAction("test", async () => {
      await new Promise((r) => setTimeout(r, 10));
      return 42;
    });
    expect(result).toEqual({ success: true, data: 42 });
  });
});

describe("ActionResult helpers", () => {
  it("ok() should create success result", () => {
    const result = ok("data");
    expect(result).toEqual({ success: true, data: "data" });
  });

  it("ok() should work with objects", () => {
    const result = ok({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("fail() should create failure result", () => {
    const result = fail(ErrorCode.FORBIDDEN, "message");
    expect(result).toEqual({
      success: false,
      error: { code: ErrorCode.FORBIDDEN, message: "message" },
    });
  });

  it("isError() should return true for fail results", () => {
    const result = fail(ErrorCode.UNEXPECTED, "err");
    expect(isError(result)).toBe(true);
  });

  it("isError() should return false for ok results", () => {
    const result = ok("data");
    expect(isError(result)).toBe(false);
  });
});
