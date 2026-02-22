import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Redis and Ratelimit before import
vi.mock("@upstash/redis", () => {
  const RedisClass = function () {
    return {};
  };
  return { Redis: RedisClass };
});

vi.mock("@upstash/ratelimit", () => {
  function RatelimitClass() {
    return { limit: vi.fn().mockResolvedValue({ success: true }) };
  }
  RatelimitClass.slidingWindow = vi.fn().mockReturnValue({});
  return { Ratelimit: RatelimitClass };
});

import { getClientIP, getClientIPFromHeaders } from "@/app/lib/rate-limit";
import { headers } from "next/headers";

describe("rate-limit", () => {
  describe("getClientIP", () => {
    it("should return 'server-action' when no request is provided", () => {
      const ip = getClientIP();
      expect(ip).toBe("server-action");
    });

    it("should return 'server-action' when request is undefined", () => {
      const ip = getClientIP(undefined);
      expect(ip).toBe("server-action");
    });

    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost", {
        headers: { "x-forwarded-for": "203.0.113.1, 70.41.3.18" },
      });
      const ip = getClientIP(request);
      expect(ip).toBe("203.0.113.1");
    });

    it("should return first IP when multiple IPs in x-forwarded-for", () => {
      const request = new Request("http://localhost", {
        headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1, 172.16.0.1" },
      });
      const ip = getClientIP(request);
      expect(ip).toBe("192.168.1.1");
    });

    it("should return 127.0.0.1 when no x-forwarded-for header", () => {
      const request = new Request("http://localhost");
      const ip = getClientIP(request);
      expect(ip).toBe("127.0.0.1");
    });

    it("should handle single IP in x-forwarded-for", () => {
      const request = new Request("http://localhost", {
        headers: { "x-forwarded-for": "10.0.0.5" },
      });
      const ip = getClientIP(request);
      expect(ip).toBe("10.0.0.5");
    });
  });

  describe("Rate limiters are defined", () => {
    it("should export nicknameCheckLimiter", async () => {
      const mod = await import("@/app/lib/rate-limit");
      expect(mod.nicknameCheckLimiter).toBeDefined();
    });

    it("should export emailAuthLimiter", async () => {
      const mod = await import("@/app/lib/rate-limit");
      expect(mod.emailAuthLimiter).toBeDefined();
    });

    it("should export oauthLimiter", async () => {
      const mod = await import("@/app/lib/rate-limit");
      expect(mod.oauthLimiter).toBeDefined();
    });

    it("should export feedbackLimiter", async () => {
      const mod = await import("@/app/lib/rate-limit");
      expect(mod.feedbackLimiter).toBeDefined();
    });
  });

  describe("getClientIPFromHeaders", () => {
    it("should extract IP from x-forwarded-for header", async () => {
      const mockHeaders = new Map([
        ["x-forwarded-for", "203.0.113.1, 70.41.3.18"],
      ]);
      vi.mocked(headers).mockResolvedValue(mockHeaders as any);

      const ip = await getClientIPFromHeaders();
      expect(ip).toBe("203.0.113.1");
    });

    it("should fall back to x-real-ip", async () => {
      const mockHeaders = new Map([["x-real-ip", "10.0.0.5"]]);
      vi.mocked(headers).mockResolvedValue(mockHeaders as any);

      const ip = await getClientIPFromHeaders();
      expect(ip).toBe("10.0.0.5");
    });

    it("should return 'unknown' when no IP headers present", async () => {
      const mockHeaders = new Map();
      vi.mocked(headers).mockResolvedValue(mockHeaders as any);

      const ip = await getClientIPFromHeaders();
      expect(ip).toBe("unknown");
    });

    it("should trim whitespace from x-forwarded-for IP", async () => {
      const mockHeaders = new Map([
        ["x-forwarded-for", " 192.168.1.1 , 10.0.0.1"],
      ]);
      vi.mocked(headers).mockResolvedValue(mockHeaders as any);

      const ip = await getClientIPFromHeaders();
      expect(ip).toBe("192.168.1.1");
    });
  });
});
