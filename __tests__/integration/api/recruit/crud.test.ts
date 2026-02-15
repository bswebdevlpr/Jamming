import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "leader-id" } },
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
}));

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));
vi.mock("@/app/lib/functions/validate", () => ({
  sanitize: vi.fn(async (t: string) => t),
}));
vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { createRecruitPost } from "@/app/api/functions/recruit/create";
import { updateRecruitPost, closeRecruitPost } from "@/app/api/functions/recruit/update";
import { deleteRecruitPost } from "@/app/api/functions/recruit/delete";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";

const recruitInput = {
  band_id: "band-1",
  user_id: "leader-id",
  title: "기타리스트 구합니다",
  body: "저희 밴드에 오세요",
  positions: [{ pos: "기타", headcnt: 1 }],
  genre: [GenreEnum.Rock] as GenreEnum[],
  level: [LevelEnum.Amature] as LevelEnum[],
  location: LocationEnum.SeoUl,
  deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
};

describe("Recruit CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "leader-id" } },
      error: null,
    });
  });

  describe("createRecruitPost", () => {
    it("should create recruit post successfully", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // band lookup
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "band-1", leader_id: "leader-id" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 2) {
          // active count check
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
              }),
            }),
          };
        }
        // insert
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "recruit-1", ...recruitInput },
                error: null,
              }),
            }),
          }),
        };
      });

      const result = await createRecruitPost(recruitInput);
      expect(result.success).toBe(true);
    });

    it("should reject if not band leader", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "band-1", leader_id: "other-leader" },
              error: null,
            }),
          }),
        }),
      });

      const result = await createRecruitPost(recruitInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_BAND_LEADER");
      }
    });

    it("should reject when band already has active recruit post", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "band-1", leader_id: "leader-id" },
                  error: null,
                }),
              }),
            }),
          };
        }
        // active count = 1
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 1, error: null }),
            }),
          }),
        };
      });

      const result = await createRecruitPost(recruitInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_FAILED");
      }
    });

    it("should reject past deadline", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "band-1", leader_id: "leader-id" },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          }),
        };
      });

      const result = await createRecruitPost({
        ...recruitInput,
        deadline: new Date(Date.now() - 86400000).toISOString(), // yesterday
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_FAILED");
      }
    });
  });

  describe("updateRecruitPost", () => {
    it("should update recruit post when author", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "recruit-1", user_id: "leader-id" },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      });

      const result = await updateRecruitPost("recruit-1", {
        title: "수정된 제목",
      });
      expect(result.success).toBe(true);
    });

    it("should reject when not author", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "recruit-1", user_id: "other-user" },
              error: null,
            }),
          }),
        }),
      });

      const result = await updateRecruitPost("recruit-1", {
        title: "test",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("closeRecruitPost", () => {
    it("should close recruit post when band leader", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "recruit-1",
                    user_id: "leader-id",
                    band_id: "band-1",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { leader_id: "leader-id" },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      });

      const result = await closeRecruitPost("recruit-1");
      expect(result.success).toBe(true);
    });

    it("should reject when not band leader", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "recruit-1",
                    user_id: "leader-id",
                    band_id: "band-1",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { leader_id: "other-leader" },
                error: null,
              }),
            }),
          }),
        };
      });

      const result = await closeRecruitPost("recruit-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_BAND_LEADER");
      }
    });
  });

  describe("deleteRecruitPost", () => {
    it("should delete recruit post when author", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "recruit-1",
                    user_id: "leader-id",
                    images: [],
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      });

      const result = await deleteRecruitPost("recruit-1");
      expect(result.success).toBe(true);
    });

    it("should reject when not author", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: "recruit-1",
                user_id: "other-user",
                images: [],
              },
              error: null,
            }),
          }),
        }),
      });

      const result = await deleteRecruitPost("recruit-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });

    it("should clean up images from storage", async () => {
      const mockRemove = vi.fn().mockResolvedValue({ data: null });
      mockClient.storage.from.mockReturnValue({ remove: mockRemove });

      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "recruit-1",
                    user_id: "leader-id",
                    images: ["img1.jpg", "img2.jpg"],
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      });

      await deleteRecruitPost("recruit-1");
      expect(mockRemove).toHaveBeenCalledWith(["img1.jpg", "img2.jpg"]);
    });
  });
});
