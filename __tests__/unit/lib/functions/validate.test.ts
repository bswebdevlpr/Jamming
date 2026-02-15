import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase before importing the module
const mockSignOut = vi.fn().mockResolvedValue({ error: null });
const mockGetUser = vi.fn().mockResolvedValue({
  data: { user: { id: "test-user-id" } },
  error: null,
});
const mockUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ error: null }),
});
const mockFrom = vi.fn().mockReturnValue({
  update: mockUpdate,
});

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
    from: mockFrom,
  })),
}));

import { sanitize, sanitizePublic } from "@/app/lib/functions/validate";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";

describe("sanitize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return clean text unchanged", async () => {
    const result = await sanitize("Hello world");
    expect(result).toBe("Hello world");
  });

  it("should sanitize HTML script tags", async () => {
    const result = await sanitize('<script>alert("xss")</script>');
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("</script>");
  });

  it("should deactivate user when XSS detected (length differs)", async () => {
    const malicious = '<script>alert("xss")</script>';
    await sanitize(malicious);

    // User should be deactivated
    expect(mockFrom).toHaveBeenCalledWith("user");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "i" }); // UserStatus.Inactive
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("should not deactivate user for clean text", async () => {
    await sanitize("normal text");
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should sanitize iframe tags", async () => {
    const result = await sanitize(
      '<iframe src="http://evil.com"></iframe>Hello'
    );
    expect(result).not.toContain("<iframe");
  });

  it("should sanitize event handler attributes", async () => {
    const result = await sanitize('<img onerror="alert(1)" src="x">');
    expect(result).not.toContain("onerror");
  });

  it("should handle empty string", async () => {
    const result = await sanitize("");
    expect(result).toBe("");
  });

  it("should preserve normal HTML-safe content", async () => {
    const result = await sanitize("일반 텍스트 with numbers 123");
    expect(result).toBe("일반 텍스트 with numbers 123");
  });
});

describe("sanitizePublic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return clean text unchanged", async () => {
    const result = await sanitizePublic("Public feedback text");
    expect(result).toBe("Public feedback text");
  });

  it("should throw SECURITY_VIOLATION for XSS attempt", async () => {
    await expect(
      sanitizePublic('<script>alert("xss")</script>')
    ).rejects.toThrow();

    try {
      await sanitizePublic('<script>alert("xss")</script>');
    } catch (e) {
      expect(e).toBeInstanceOf(CustomError);
      expect((e as CustomError).code).toBe(ErrorCode.SECURITY_VIOLATION);
    }
  });

  it("should not call signOut for public sanitize (no auth needed)", async () => {
    try {
      await sanitizePublic("<script>bad</script>");
    } catch {
      // expected
    }
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should handle empty string", async () => {
    const result = await sanitizePublic("");
    expect(result).toBe("");
  });
});
