import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the custom-error module before importing logger
vi.mock("@/app/lib/errors/custom-error", async () => {
  const actual = await vi.importActual("@/app/lib/errors/custom-error");
  return actual;
});

import { logger } from "@/app/lib/logger";
import { CustomError } from "@/app/lib/errors/custom-error";

describe("logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  describe("error", () => {
    it("should log CustomError with context", () => {
      const error = CustomError.forbidden({ operation: "test" });
      logger.error("testOp", error);
      expect(console.error).toHaveBeenCalled();
    });

    it("should log standard Error", () => {
      const error = new Error("standard error");
      logger.error("testOp", error);
      expect(console.error).toHaveBeenCalled();
    });

    it("should log unknown error type", () => {
      logger.error("testOp", "string error");
      expect(console.error).toHaveBeenCalled();
    });

    it("should log with operation name", () => {
      logger.error("myOperation", new Error("test"));
      expect(console.error).toHaveBeenCalled();
    });

    it("should output JSON in production mode (non-dev)", () => {
      // Since NODE_ENV is "test" (not "development"), isDev is false
      // So logger should output JSON format
      const error = CustomError.forbidden({ operation: "test" });
      logger.error("testOp", error);
      const callArg = (console.error as any).mock.calls[0][0];
      // In production mode, it outputs JSON.stringify
      expect(() => JSON.parse(callArg)).not.toThrow();
    });

    it("should include error details in production JSON", () => {
      const error = new Error("test error");
      logger.error("testOp", error);
      // Get the last call to console.error (in case spy has previous calls)
      const calls = (console.error as any).mock.calls;
      const callArg = calls[calls.length - 1][0];
      const parsed = JSON.parse(callArg);
      expect(parsed.level).toBe("error");
      expect(parsed.operation).toBe("testOp");
      expect(parsed.message).toBe("test error");
    });
  });

  describe("warn", () => {
    it("should log warning message", () => {
      logger.warn("testOp", "warning message");
      expect(console.warn).toHaveBeenCalled();
    });

    it("should log warning with context", () => {
      logger.warn("testOp", "warning", { key: "value" });
      expect(console.warn).toHaveBeenCalled();
    });

    it("should output JSON in production mode", () => {
      logger.warn("testOp", "warning message");
      const callArg = (console.warn as any).mock.calls[0][0];
      const parsed = JSON.parse(callArg);
      expect(parsed.level).toBe("warn");
      expect(parsed.operation).toBe("testOp");
    });
  });

  describe("info", () => {
    it("should not log in non-development mode", () => {
      // NODE_ENV is "test", so isDev is false, info should be silent
      logger.info("testOp", "info message");
      expect(console.info).not.toHaveBeenCalled();
    });

    it("should log info message when isDev is true", async () => {
      // To test dev mode, we need to re-import the module with NODE_ENV=development
      vi.resetModules();
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const { logger: devLogger } = await import("@/app/lib/logger");
      devLogger.info("testOp", "info message");
      expect(console.info).toHaveBeenCalledWith("[testOp] info message");

      process.env.NODE_ENV = origEnv;
    });
  });
});
