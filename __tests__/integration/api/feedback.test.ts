import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockLimit, mockClient, mockAuthUser, mockHeaders } = vi.hoisted(
  () => ({
    mockLimit: vi.fn().mockResolvedValue({ success: true }),
    mockClient: {
      from: vi.fn(),
      auth: { getUser: vi.fn() },
    },
    mockAuthUser: { id: "test-user-id" },
    mockHeaders: vi.fn(),
  })
);

vi.mock("@upstash/redis", () => {
  function RedisClass() {
    return {};
  }
  return { Redis: RedisClass };
});

vi.mock("@upstash/ratelimit", () => {
  function RatelimitClass() {
    return { limit: mockLimit };
  }
  RatelimitClass.slidingWindow = vi.fn().mockReturnValue({});
  return { Ratelimit: RatelimitClass };
});

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));

vi.mock("@/app/lib/functions/validate", () => ({
  sanitize: vi.fn(async (text: string) => text),
  sanitizePublic: vi.fn(async (text: string) => text),
}));

vi.mock("next/headers", () => ({
  headers: mockHeaders,
}));

vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

vi.mock("@/app/api/functions/read", () => ({
  getUser: vi.fn(async () => mockAuthUser),
}));

import { createPublicFeedback } from "@/app/api/functions/create";
import { createFeedback } from "@/app/(pages)/(only-user)/mypage/functions/fetch";

describe("Feedback Rate Limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue({ success: true });
    mockClient.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
    mockHeaders.mockResolvedValue(
      new Map([["x-forwarded-for", "203.0.113.1"]])
    );
  });

  describe("createPublicFeedback", () => {
    it("should succeed when under rate limit", async () => {
      mockClient.auth.getUser.mockRejectedValue(new Error("Not authenticated"));
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: true, error: null }),
      });

      const result = await createPublicFeedback("테스트 피드백");
      expect(result.success).toBe(true);
      expect(mockLimit).toHaveBeenCalled();
    });

    it("should fail with RATE_LIMIT_EXCEEDED when limit exceeded", async () => {
      mockLimit.mockResolvedValueOnce({ success: false });
      mockClient.auth.getUser.mockRejectedValue(new Error("Not authenticated"));

      const result = await createPublicFeedback("테스트 피드백");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("RATE_LIMIT_EXCEEDED");
      }
    });

    it("should use user_id as identifier for logged-in users", async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockAuthUser },
      });
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: true, error: null }),
      });

      await createPublicFeedback("테스트");
      expect(mockLimit).toHaveBeenCalledWith(
        `feedback:user:${mockAuthUser.id}`
      );
    });

    it("should use IP as identifier for anonymous users", async () => {
      mockClient.auth.getUser.mockRejectedValue(new Error("Not authenticated"));
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: true, error: null }),
      });

      await createPublicFeedback("테스트");
      expect(mockLimit).toHaveBeenCalledWith("feedback:ip:203.0.113.1");
    });

    it("should reject empty input", async () => {
      mockClient.auth.getUser.mockRejectedValue(new Error("Not authenticated"));
      vi.mocked(
        (await import("@/app/lib/functions/validate")).sanitizePublic
      ).mockResolvedValueOnce("");

      const result = await createPublicFeedback("");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_FAILED");
      }
    });

    it("should reject input longer than 100 chars", async () => {
      mockClient.auth.getUser.mockRejectedValue(new Error("Not authenticated"));
      const longText = "a".repeat(101);
      vi.mocked(
        (await import("@/app/lib/functions/validate")).sanitizePublic
      ).mockResolvedValueOnce(longText);

      const result = await createPublicFeedback(longText);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_FAILED");
      }
    });
  });

  describe("createFeedback (mypage)", () => {
    it("should succeed when under rate limit", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
        }),
      });

      const result = await createFeedback("테스트 피드백");
      expect(result.success).toBe(true);
      expect(mockLimit).toHaveBeenCalled();
    });

    it("should fail with RATE_LIMIT_EXCEEDED when limit exceeded", async () => {
      mockLimit.mockResolvedValueOnce({ success: false });

      const result = await createFeedback("테스트 피드백");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("RATE_LIMIT_EXCEEDED");
      }
    });

    it("should share rate limit with public feedback via same identifier", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
        }),
      });

      await createFeedback("테스트");
      expect(mockLimit).toHaveBeenCalledWith(
        `feedback:user:${mockAuthUser.id}`
      );
    });

    it("should validate input length (empty)", async () => {
      vi.mocked(
        (await import("@/app/lib/functions/validate")).sanitize
      ).mockResolvedValueOnce("");

      const result = await createFeedback("");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_FAILED");
      }
    });

    it("should validate input length (over 100)", async () => {
      const longText = "a".repeat(101);
      vi.mocked(
        (await import("@/app/lib/functions/validate")).sanitize
      ).mockResolvedValueOnce(longText);

      const result = await createFeedback(longText);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_FAILED");
      }
    });
  });
});
