import { vi } from "vitest";

/**
 * Mock Upstash Redis and Ratelimit
 *
 * Mocks all rate limiters used in the project:
 * - nicknameCheckLimiter
 * - emailAuthLimiter
 * - oauthLimiter
 */

export const mockRateLimitSuccess = { success: true, limit: 5, remaining: 4, reset: Date.now() + 60000 };
export const mockRateLimitFail = { success: false, limit: 5, remaining: 0, reset: Date.now() + 60000 };

export const mockLimit = vi.fn().mockResolvedValue(mockRateLimitSuccess);

export function setupRateLimitMock() {
  vi.mock("@upstash/redis", () => ({
    Redis: vi.fn().mockImplementation(() => ({
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    })),
  }));

  vi.mock("@upstash/ratelimit", () => ({
    Ratelimit: Object.assign(
      vi.fn().mockImplementation(() => ({
        limit: mockLimit,
      })),
      {
        slidingWindow: vi.fn().mockReturnValue({}),
      }
    ),
  }));
}

/**
 * Mock rate limit to succeed
 */
export function mockRateLimitAllow() {
  mockLimit.mockResolvedValue(mockRateLimitSuccess);
}

/**
 * Mock rate limit to deny
 */
export function mockRateLimitDeny() {
  mockLimit.mockResolvedValue(mockRateLimitFail);
}
