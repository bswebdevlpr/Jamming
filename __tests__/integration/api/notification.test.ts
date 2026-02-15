import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-id" } },
        error: null,
      }),
    },
    from: vi.fn(),
  },
}));

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));
vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
} from "@/app/api/functions/notification";

describe("Notification CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-id" } },
      error: null,
    });
  });

  describe("getNotifications", () => {
    it("should return notifications list", async () => {
      const mockData = [
        { id: 1, title: "알림1", is_read: false },
        { id: 2, title: "알림2", is_read: true },
      ];
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: vi.fn().mockResolvedValue({
                data: mockData,
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await getNotifications(20, 0);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
      }
    });

    it("should return empty array when no notifications", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await getNotifications();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it("should fail when not authenticated", async () => {
      mockClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: "Not authenticated" },
      });

      const result = await getNotifications();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INVALID_SESSION");
      }
    });
  });

  describe("getUnreadCount", () => {
    it("should return unread count", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
          }),
        }),
      });

      const result = await getUnreadCount();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5);
      }
    });

    it("should return 0 when null count", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: null, error: null }),
          }),
        }),
      });

      const result = await getUnreadCount();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      mockClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      const result = await markAsRead(1);
      expect(result.success).toBe(true);
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read", async () => {
      mockClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      const result = await markAllAsRead();
      expect(result.success).toBe(true);
    });
  });

  describe("createNotification", () => {
    it("should create a notification", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await createNotification(
        "target-user-id",
        "system",
        "환영합니다",
        "가입을 축하합니다",
        { extra: "data" }
      );
      expect(result.success).toBe(true);
    });

    it("should handle insert error", async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: { code: "500", message: "Insert failed" },
        }),
      });

      const result = await createNotification(
        "target-user-id",
        "system",
        "test"
      );
      expect(result.success).toBe(false);
    });
  });
});
