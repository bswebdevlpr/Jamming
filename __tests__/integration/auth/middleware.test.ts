import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock @supabase/ssr createServerClient
const mockGetUser = vi.fn();
const mockSupabaseFrom = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockSupabaseFrom,
  })),
}));

import { updateSession } from "@/app/util/supabase/middleware";

function createMockRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3038"));
}

describe("Middleware - updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";
  });

  describe("Public paths", () => {
    it("should allow access to /jamsession/post/ without auth", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      const request = createMockRequest("/jamsession/post/123");
      const response = await updateSession(request);
      // Should not redirect (status 200 means pass-through)
      expect(response.status).toBe(200);
    });
  });

  describe("Protected paths - unauthenticated user", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    });

    it("should redirect /jamsession to /signin", async () => {
      const request = createMockRequest("/jamsession");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/signin");
    });

    it("should include redirect param with original path", async () => {
      const request = createMockRequest("/jamsession");
      const response = await updateSession(request);
      const location = response.headers.get("location")!;
      expect(location).toContain("redirect=%2Fjamsession");
    });

    it("should redirect /mypage to /signin", async () => {
      const request = createMockRequest("/mypage");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/signin");
    });

    it("should redirect /myact to /signin", async () => {
      const request = createMockRequest("/myact");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/signin");
    });

    it("should redirect /user-profile to /signin", async () => {
      const request = createMockRequest("/user-profile/nickname");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
    });

    it("should redirect /band to /signin", async () => {
      const request = createMockRequest("/band");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
    });

    it("should redirect /recruit to /signin", async () => {
      const request = createMockRequest("/recruit");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
    });
  });

  describe("Protected paths - authenticated user", () => {
    it("should allow access for authenticated user", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      const request = createMockRequest("/jamsession");
      const response = await updateSession(request);
      expect(response.status).toBe(200);
    });
  });

  describe("Guest-only paths", () => {
    it("should redirect logged-in user from /signin to / (existing user)", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: "user-1" },
              error: null,
            }),
          }),
        }),
      });

      const request = createMockRequest("/signin");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
      const location = response.headers.get("location")!;
      expect(location).toContain("/");
    });

    it("should redirect logged-in user from /signin to /signup (new user, no DB record)", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "new-user-1" } },
        error: null,
      });
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      const request = createMockRequest("/signin");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
      const location = response.headers.get("location")!;
      expect(location).toContain("/signup");
    });

    it("should allow unauthenticated user to access /signin", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      const request = createMockRequest("/signin");
      const response = await updateSession(request);
      // Not a redirect (not redirected away from /signin)
      expect(response.status).toBe(200);
    });
  });

  describe("Signup redirect loop prevention", () => {
    it("should allow new user (no DB record) to access /signup without redirect", async () => {
      // OAuth 신규 사용자: 세션 있음, DB 레코드 없음
      mockGetUser.mockResolvedValue({
        data: { user: { id: "new-oauth-user" } },
        error: null,
      });
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      const request = createMockRequest("/signup");
      const response = await updateSession(request);
      // 무한 루프 방지: 200 (통과)이어야 함, 307 (리디렉션)이면 안됨
      expect(response.status).toBe(200);
    });

    it("should allow new user to access /signup/profile", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "new-oauth-user" } },
        error: null,
      });
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      const request = createMockRequest(
        "/signup/profile?accept_marketing=true"
      );
      const response = await updateSession(request);
      expect(response.status).toBe(200);
    });

    it("should redirect existing user from /signup to /", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "existing-user" } },
        error: null,
      });
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: "existing-user" },
              error: null,
            }),
          }),
        }),
      });

      const request = createMockRequest("/signup");
      const response = await updateSession(request);
      expect(response.status).toBe(307);
      const location = response.headers.get("location")!;
      expect(location).toContain("/");
      expect(location).not.toContain("/signup");
    });
  });

  describe("API auth callback", () => {
    it("should pass through /api/auth/callback without redirect", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      const request = createMockRequest("/api/auth/callback?code=test123");
      const response = await updateSession(request);
      expect(response.status).toBe(200);
    });
  });

  describe("Error handling", () => {
    it("should allow page access even when Supabase auth check fails", async () => {
      mockGetUser.mockRejectedValue(new Error("Supabase is down"));
      const request = createMockRequest("/jamsession");
      const response = await updateSession(request);
      // On error, middleware falls through - page access allowed
      expect(response.status).toBe(200);
    });
  });
});
