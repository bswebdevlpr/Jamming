import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase
const mockExchangeCodeForSession = vi.fn();
const mockSelectUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
    from: mockFrom,
  })),
}));

import { GET } from "@/app/api/auth/callback/route";

describe("OAuth Callback - GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "test";
    process.env.DOMAIN = "http://localhost:3038";
    process.env.ALLOWED_HOSTS = "localhost";
  });

  it("should redirect to signin on missing code", async () => {
    const request = new Request("http://localhost:3038/api/auth/callback");
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/signin?error=auth_code_error");
  });

  it("should exchange code for session on valid code", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            then: vi.fn((cb: Function) => cb({ data: { id: "user-1" } })),
          }),
        }),
      }),
    });

    const request = new Request(
      "http://localhost:3038/api/auth/callback?code=valid-code"
    );
    const response = await GET(request);
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid-code");
    expect(response.status).toBe(307);
  });

  it("should redirect to / for existing user", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            then: vi.fn((cb: Function) => cb({ data: { id: "user-1" } })),
          }),
        }),
      }),
    });

    const request = new Request(
      "http://localhost:3038/api/auth/callback?code=valid-code"
    );
    const response = await GET(request);
    const location = response.headers.get("location");
    expect(location).toContain("/");
    expect(location).not.toContain("/signup");
  });

  it("should redirect to /signup for new user (no DB record)", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: "new-user-1" } },
      error: null,
    });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            then: vi.fn((cb: Function) => cb({ data: null })),
          }),
        }),
      }),
    });

    const request = new Request(
      "http://localhost:3038/api/auth/callback?code=valid-code"
    );
    const response = await GET(request);
    const location = response.headers.get("location");
    expect(location).toContain("/signup");
  });

  it("should redirect to signin on session exchange error", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: null,
      error: { message: "Session exchange failed", status: 400 },
    });

    const request = new Request(
      "http://localhost:3038/api/auth/callback?code=bad-code"
    );
    const response = await GET(request);
    const location = response.headers.get("location");
    expect(location).toContain("/signin?error=auth_code_error");
  });

  it("should redirect with org_restricted error when org error", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: null,
      error: { message: "Organization restricted access", status: 403 },
    });

    const request = new Request(
      "http://localhost:3038/api/auth/callback?code=org-code"
    );
    const response = await GET(request);
    const location = response.headers.get("location");
    expect(location).toContain("error=org_restricted");
  });

  // Open Redirect Prevention Tests
  describe("Open Redirect Prevention", () => {
    function setupSuccessfulAuth() {
      mockExchangeCodeForSession.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({
              then: vi.fn((cb: Function) => cb({ data: { id: "user-1" } })),
            }),
          }),
        }),
      });
    }

    it("should allow valid relative redirect path", async () => {
      setupSuccessfulAuth();
      const request = new Request(
        "http://localhost:3038/api/auth/callback?code=valid-code&redirect=/jamsession"
      );
      const response = await GET(request);
      const location = response.headers.get("location");
      expect(location).toContain("/jamsession");
    });

    it("should block absolute URL redirect (//evil.com)", async () => {
      setupSuccessfulAuth();
      const request = new Request(
        "http://localhost:3038/api/auth/callback?code=valid-code&redirect=//evil.com"
      );
      const response = await GET(request);
      const location = response.headers.get("location");
      expect(location).not.toContain("evil.com");
    });

    it("should block backslash-based redirect", async () => {
      setupSuccessfulAuth();
      const request = new Request(
        "http://localhost:3038/api/auth/callback?code=valid-code&redirect=/\\evil.com"
      );
      const response = await GET(request);
      const location = response.headers.get("location");
      expect(location).not.toContain("evil.com");
    });

    it("should block percent-encoded redirect", async () => {
      setupSuccessfulAuth();
      const request = new Request(
        "http://localhost:3038/api/auth/callback?code=valid-code&redirect=/%2F%2Fevil.com"
      );
      const response = await GET(request);
      const location = response.headers.get("location")!;
      // The redirect param itself contains %, so isValidRedirect should be false
      expect(location.endsWith("/")).toBe(true);
      expect(location).not.toContain("evil.com");
    });

    it("should default to / when redirect is invalid", async () => {
      setupSuccessfulAuth();
      const request = new Request(
        "http://localhost:3038/api/auth/callback?code=valid-code&redirect=//evil.com"
      );
      const response = await GET(request);
      const location = response.headers.get("location")!;
      // Should redirect to / (root), not to evil.com
      expect(location.endsWith("/")).toBe(true);
    });
  });
});
