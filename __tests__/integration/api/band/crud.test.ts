import { describe, it, expect, vi, beforeEach } from "vitest";

// Create hoisted mocks
const { mockClient, mockQueryBuilder } = vi.hoisted(() => {
  const qb: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    then: vi.fn(),
  };
  return {
    mockQueryBuilder: qb,
    mockClient: {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "leader-id" } },
          error: null,
        }),
      },
      from: vi.fn(() => qb),
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
  sanitize: vi.fn(async (t: string) => t),
}));
vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { createBand } from "@/app/api/functions/band/create";
import { updateBand } from "@/app/api/functions/band/update";
import { deleteBand } from "@/app/api/functions/band/delete";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";

const bandInput = {
  leader_id: "leader-id",
  name: "테스트밴드",
  description: "밴드 소개",
  genre: [GenreEnum.Rock] as GenreEnum[],
  location: LocationEnum.SeoUl,
  level: LevelEnum.Amature,
  tags: ["#락"],
};

describe("Band CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "leader-id" } },
      error: null,
    });
  });

  describe("createBand", () => {
    it("should create a band when under limits", async () => {
      // Mock leader count check (0 bands)
      let callCount = 0;
      mockClient.from.mockImplementation((table: string) => {
        callCount++;
        if (callCount === 1) {
          // leader count check
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          };
        }
        if (callCount === 2) {
          // total count check
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          };
        }
        if (callCount === 3) {
          // band insert
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "new-band-id", ...bandInput },
                  error: null,
                }),
              }),
            }),
          };
        }
        // member insert
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      });

      const result = await createBand(bandInput);
      expect(result.success).toBe(true);
    });

    it("should reject when leader has 3+ bands", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ count: 3, error: null }),
        }),
      });

      const result = await createBand(bandInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("BAND_LIMIT_REACHED");
      }
    });

    it("should reject when user is in 5+ bands total", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 1, error: null }),
            }),
          };
        }
        // total count = 5
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
          }),
        };
      });

      const result = await createBand(bandInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("BAND_LIMIT_REACHED");
      }
    });

    it("should rollback band on member insert failure", async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          };
        }
        if (callCount === 2) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          };
        }
        if (callCount === 3) {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "band-to-rollback" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 4) {
          // member insert fails
          return {
            insert: vi.fn().mockResolvedValue({
              error: { code: "500", message: "member insert failed" },
            }),
          };
        }
        // rollback delete
        return { delete: mockDelete };
      });

      const result = await createBand(bandInput);
      expect(result.success).toBe(false);
      expect(mockDelete).toHaveBeenCalled();
    });

    it("should sanitize description", async () => {
      const { sanitize } = await import("@/app/lib/functions/validate");
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          };
        }
        if (callCount === 3) {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "band-1" },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      });

      await createBand({ ...bandInput, description: "test <b>desc</b>" });
      expect(sanitize).toHaveBeenCalled();
    });
  });

  describe("updateBand", () => {
    it("should update band when user is leader", async () => {
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
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      });

      const result = await updateBand("band-1", { name: "새 이름" });
      expect(result.success).toBe(true);
    });

    it("should reject when user is not leader", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "band-1", leader_id: "other-user" },
              error: null,
            }),
          }),
        }),
      });

      const result = await updateBand("band-1", { name: "새 이름" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_BAND_LEADER");
      }
    });

    it("should reject when band not found", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "PGRST116", message: "not found" },
            }),
          }),
        }),
      });

      const result = await updateBand("nonexistent", { name: "새 이름" });
      expect(result.success).toBe(false);
    });
  });

  describe("deleteBand", () => {
    it("should delete band when user is leader", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // band lookup
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "band-1",
                    leader_id: "leader-id",
                    profile_image: null,
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 2) {
          // recruit posts images
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          };
        }
        // band delete
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      });

      const result = await deleteBand("band-1");
      expect(result.success).toBe(true);
    });

    it("should reject when user is not leader", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "band-1", leader_id: "other-user" },
              error: null,
            }),
          }),
        }),
      });

      const result = await deleteBand("band-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_BAND_LEADER");
      }
    });

    it("should clean up storage images on delete", async () => {
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
                    id: "band-1",
                    leader_id: "leader-id",
                    profile_image: "band-img.jpg",
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
              eq: vi.fn().mockResolvedValue({
                data: [{ images: ["recruit-img1.jpg"] }],
                error: null,
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

      await deleteBand("band-1");
      expect(mockRemove).toHaveBeenCalledWith(
        expect.arrayContaining(["band-img.jpg", "recruit-img1.jpg"])
      );
    });
  });
});
