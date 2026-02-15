import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockClient } = vi.hoisted(() => {
  return {
    mockClient: {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
          error: null,
        }),
      },
      from: vi.fn(),
      storage: {
        from: vi.fn(() => ({
          remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      },
    },
  };
});

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));

vi.mock("@/app/lib/functions/validate", () => ({
  sanitize: vi.fn(async (text: string) => text),
  sanitizePublic: vi.fn(async (text: string) => text),
}));

vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { createJamEntry, createPublicFeedback } from "@/app/api/functions/create";
import { deleteJamSession, deleteJamEntry } from "@/app/api/functions/delete";
import { getUser } from "@/app/api/functions/read";

describe("Jam Session CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
  });

  describe("createJamEntry", () => {
    it("should create a jam entry successfully", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await createJamEntry({
        user_id: "test-user-id",
        jam_id: 1,
        appeal: "잘 부탁드립니다",
        applied_pos: "기타",
      });
      expect(result.success).toBe(true);
    });

    it("should sanitize appeal text", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const { sanitize } = await import("@/app/lib/functions/validate");
      await createJamEntry({
        user_id: "test-user-id",
        jam_id: 1,
        appeal: "test appeal",
        applied_pos: "기타",
      });
      expect(sanitize).toHaveBeenCalledWith("test appeal");
    });

    it("should return error on Supabase failure", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: { code: "23505", message: "duplicate key" },
        }),
      });

      const result = await createJamEntry({
        user_id: "test-user-id",
        jam_id: 1,
        appeal: "test",
        applied_pos: "기타",
      });
      expect(result.success).toBe(false);
    });

    it("should handle sanitize error gracefully", async () => {
      const { sanitize } = await import("@/app/lib/functions/validate");
      (sanitize as any).mockRejectedValueOnce(new Error("sanitize failed"));

      const result = await createJamEntry({
        user_id: "test-user-id",
        jam_id: 1,
        appeal: "<script>alert('xss')</script>",
        applied_pos: "기타",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createPublicFeedback", () => {
    it("should create feedback successfully", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await createPublicFeedback("좋은 서비스입니다");
      expect(result.success).toBe(true);
    });

    it("should reject empty feedback after sanitize", async () => {
      const { sanitizePublic } = await import("@/app/lib/functions/validate");
      (sanitizePublic as any).mockResolvedValueOnce("");
      const result = await createPublicFeedback("");
      expect(result.success).toBe(false);
    });

    it("should reject feedback longer than 100 chars", async () => {
      const { sanitizePublic } = await import("@/app/lib/functions/validate");
      (sanitizePublic as any).mockResolvedValueOnce("a".repeat(101));
      const result = await createPublicFeedback("a".repeat(101));
      expect(result.success).toBe(false);
    });

    it("should include user_id when authenticated", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      mockClient.from.mockReturnValue({
        insert: mockInsert,
      });

      await createPublicFeedback("좋은 서비스");
      expect(mockInsert).toHaveBeenCalledWith({
        body: "좋은 서비스",
        user_id: "test-user-id",
      });
    });

    it("should set user_id to null when not authenticated", async () => {
      mockClient.auth.getUser.mockRejectedValueOnce(new Error("No session"));
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      mockClient.from.mockReturnValue({
        insert: mockInsert,
      });

      await createPublicFeedback("피드백입니다");
      expect(mockInsert).toHaveBeenCalledWith({
        body: "피드백입니다",
        user_id: null,
      });
    });
  });

  describe("deleteJamSession", () => {
    it("should delete a jam session successfully", async () => {
      mockClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: [{ images: [] }],
              error: null,
            }),
          }),
        }),
      });
      const result = await deleteJamSession(1);
      expect(result.success).toBe(true);
    });

    it("should clean up images from storage when deleting", async () => {
      const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null });
      mockClient.storage.from.mockReturnValue({ remove: mockRemove });
      mockClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: [{ images: ["img1.jpg", "img2.jpg"] }],
              error: null,
            }),
          }),
        }),
      });
      await deleteJamSession(1);
      expect(mockRemove).toHaveBeenCalledWith(["img1.jpg", "img2.jpg"]);
    });

    it("should handle delete error", async () => {
      mockClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "delete failed" },
            }),
          }),
        }),
      });
      const result = await deleteJamSession(1);
      expect(result.success).toBe(false);
    });
  });

  describe("deleteJamEntry", () => {
    it("should delete a jam entry successfully", async () => {
      mockClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });
      const result = await deleteJamEntry(1);
      expect(result.success).toBe(true);
    });

    it("should handle delete entry error", async () => {
      mockClient.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: "entry not found" },
          }),
        }),
      });
      const result = await deleteJamEntry(1);
      expect(result.success).toBe(false);
    });
  });

  describe("getUser", () => {
    it("should return user on valid session", async () => {
      const user = await getUser(mockClient as any);
      expect(user.id).toBe("test-user-id");
    });

    it("should throw INVALID_SESSION on auth error", async () => {
      mockClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: "no session", status: 401 },
      });
      await expect(getUser(mockClient as any)).rejects.toThrow();
    });

    it("should throw INVALID_SESSION on null user", async () => {
      mockClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });
      await expect(getUser(mockClient as any)).rejects.toThrow();
    });
  });
});
