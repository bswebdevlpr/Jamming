import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockLimit, mockClient } = vi.hoisted(() => ({
  mockLimit: vi.fn().mockResolvedValue({ success: true }),
  mockClient: {
    from: vi.fn(),
  },
}));

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

import { isNicknameUnique } from "@/app/api/functions/validation";

describe("isNicknameUnique", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue({ success: true });
  });

  it("should return true when nickname is unique (no results)", async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn((cb: Function) =>
            cb({ data: [], error: null })
          ),
        }),
      }),
    });

    const result = await isNicknameUnique("새닉네임");
    expect(result).toBe(true);
  });

  it("should return false when nickname already exists", async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn((cb: Function) =>
            cb({ data: [{ nickname: "기존닉네임" }], error: null })
          ),
        }),
      }),
    });

    const result = await isNicknameUnique("기존닉네임");
    expect(result).toBe(false);
  });

  it("should throw rate limit error when limit exceeded", async () => {
    mockLimit.mockResolvedValueOnce({ success: false });
    await expect(isNicknameUnique("테스트")).rejects.toThrow();
  });

  it("should use nickname-based rate limit identifier", async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn((cb: Function) =>
            cb({ data: [], error: null })
          ),
        }),
      }),
    });

    await isNicknameUnique("테스트닉");
    expect(mockLimit).toHaveBeenCalledWith("nickname:테스트닉");
  });

  it("should handle Supabase errors gracefully", async () => {
    mockClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn(() => {
            throw new Error("DB error");
          }),
        }),
      }),
    });

    await expect(isNicknameUnique("테스트")).rejects.toThrow();
  });
});
