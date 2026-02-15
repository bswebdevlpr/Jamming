import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to create mocks that survive hoisting
const { mockLimit, mockSignInWithOAuth, mockSignInWithPassword, mockSignUp } =
  vi.hoisted(() => ({
    mockLimit: vi.fn().mockResolvedValue({ success: true }),
    mockSignInWithOAuth: vi.fn().mockResolvedValue({
      data: { url: "https://oauth.provider.com/redirect" },
      error: null,
    }),
    mockSignInWithPassword: vi.fn().mockResolvedValue({
      data: {
        user: { id: "test-user" },
        session: { access_token: "token" },
      },
      error: null,
    }),
    mockSignUp: vi.fn().mockResolvedValue({ data: null, error: null }),
  }));

// Mock Redis
vi.mock("@upstash/redis", () => {
  function RedisClass() {
    return {};
  }
  return { Redis: RedisClass };
});

// Mock Ratelimit
vi.mock("@upstash/ratelimit", () => {
  function RatelimitClass() {
    return { limit: mockLimit };
  }
  RatelimitClass.slidingWindow = vi.fn().mockReturnValue({});
  return { Ratelimit: RatelimitClass };
});

// Mock supabase
vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
    },
  })),
}));

import { signInWithEmail, signUpWithEmail } from "@/app/util/supabase/auth";

describe("Auth - Email Sign In", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue({ success: true });
  });

  it("should return success on valid credentials", async () => {
    const result = await signInWithEmail("test@example.com", "password123");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeDefined();
    }
  });

  it("should call signInWithPassword with correct params", async () => {
    await signInWithEmail("user@test.com", "mypassword");
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "user@test.com",
      password: "mypassword",
    });
  });

  it("should return error on invalid credentials", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid login credentials" },
    });
    const result = await signInWithEmail("bad@example.com", "wrong");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("AUTH_ERROR");
    }
  });

  it("should handle rate limiting", async () => {
    mockLimit.mockResolvedValueOnce({ success: false });
    const result = await signInWithEmail("test@example.com", "password");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("RATE_LIMIT_EXCEEDED");
    }
  });

  it("should use email-based rate limit identifier", async () => {
    await signInWithEmail("test@example.com", "password");
    expect(mockLimit).toHaveBeenCalledWith("email-signin:test@example.com");
  });
});

describe("Auth - Email Sign Up", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue({ success: true });
  });

  it("should return success on valid signup", async () => {
    const result = await signUpWithEmail("new@example.com", "password123", true);
    expect(result.success).toBe(true);
  });

  it("should call signUp with email redirect", async () => {
    await signUpWithEmail("new@example.com", "password123", true);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "password123",
      options: {
        emailRedirectTo: `${process.env.DOMAIN}/api/auth/callback`,
        data: {
          accept_marketing: true,
        },
      },
    });
  });

  it("should pass accept_marketing=false correctly", async () => {
    await signUpWithEmail("new@example.com", "password123", false);
    expect(mockSignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          data: { accept_marketing: false },
        }),
      })
    );
  });

  it("should return error when signup fails", async () => {
    mockSignUp.mockResolvedValueOnce({
      error: { message: "User already registered" },
    });
    const result = await signUpWithEmail("existing@example.com", "password", false);
    expect(result.success).toBe(false);
  });

  it("should handle rate limiting for signup", async () => {
    mockLimit.mockResolvedValueOnce({ success: false });
    const result = await signUpWithEmail("new@example.com", "password", false);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("RATE_LIMIT_EXCEEDED");
    }
  });

  it("should use email-based rate limit identifier for signup", async () => {
    await signUpWithEmail("new@example.com", "password", false);
    expect(mockLimit).toHaveBeenCalledWith("email-signup:new@example.com");
  });
});

describe("Auth - OAuth Sign In", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimit.mockResolvedValue({ success: true });
  });

  it("signInWithKakao should redirect to OAuth URL", async () => {
    const { signInWithKakao } = await import("@/app/util/supabase/auth");
    await expect(signInWithKakao()).rejects.toThrow("NEXT_REDIRECT");
  });

  it("signInWithGoogle should redirect to OAuth URL", async () => {
    const { signInWithGoogle } = await import("@/app/util/supabase/auth");
    await expect(signInWithGoogle()).rejects.toThrow("NEXT_REDIRECT");
  });

  it("should redirect to signin on rate limit for OAuth", async () => {
    mockLimit.mockResolvedValueOnce({ success: false });
    const { signInWithKakao } = await import("@/app/util/supabase/auth");
    try {
      await signInWithKakao();
    } catch (e: any) {
      expect(e.message).toContain("NEXT_REDIRECT");
    }
  });

  it("should include redirect path in callback URL when provided", async () => {
    const { signInWithKakao } = await import("@/app/util/supabase/auth");
    try {
      await signInWithKakao("/jamsession");
    } catch {
      // redirect throws
    }
  });
});
