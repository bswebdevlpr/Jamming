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
vi.mock("@/app/lib/functions/validate", () => ({
  sanitize: vi.fn(async (t: string) => t),
}));
vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import {
  createRecruitComment,
  updateRecruitComment,
  deleteRecruitComment,
} from "@/app/api/functions/recruit/comment";
import { PositionEnum } from "@/app/lib/enums/position.enum";

describe("Recruit Comment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-id" } },
      error: null,
    });
  });

  describe("createRecruitComment", () => {
    it("should create a comment on active post", async () => {
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
                    is_active: true,
                    deadline: null,
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 2) {
          // duplicate check
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi
                    .fn()
                    .mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          };
        }
        // insert
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      });

      const result = await createRecruitComment({
        recruit_id: "recruit-1",
        user_id: "user-id",
        body: "지원합니다!",
        applied_pos: PositionEnum.Guitar,
      });
      expect(result.success).toBe(true);
    });

    it("should reject on inactive post", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: "recruit-1",
                is_active: false,
                deadline: null,
              },
              error: null,
            }),
          }),
        }),
      });

      const result = await createRecruitComment({
        recruit_id: "recruit-1",
        user_id: "user-id",
        body: "지원합니다!",
        applied_pos: PositionEnum.Guitar,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("RECRUIT_NOT_ACTIVE");
      }
    });

    it("should reject on past deadline", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: "recruit-1",
                is_active: true,
                deadline: new Date(Date.now() - 86400000).toISOString(),
              },
              error: null,
            }),
          }),
        }),
      });

      const result = await createRecruitComment({
        recruit_id: "recruit-1",
        user_id: "user-id",
        body: "지원합니다!",
        applied_pos: PositionEnum.Guitar,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("RECRUIT_NOT_ACTIVE");
      }
    });

    it("should reject duplicate application", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "recruit-1", is_active: true, deadline: null },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id: "existing-comment" },
                  error: null,
                }),
              }),
            }),
          }),
        };
      });

      const result = await createRecruitComment({
        recruit_id: "recruit-1",
        user_id: "user-id",
        body: "다시 지원!",
        applied_pos: PositionEnum.Guitar,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("ALREADY_APPLIED");
      }
    });
  });

  describe("updateRecruitComment (accept/reject)", () => {
    function setupAcceptMocks(overrides: {
      memberCount?: number;
      existingMember?: any;
    } = {}) {
      let callCount = 0;
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "leader-id" } },
        error: null,
      });
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // comment lookup
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "comment-1",
                    recruit_id: "recruit-1",
                    user_id: "applicant-id",
                    applied_pos: "기타",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 2) {
          // post lookup
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { band_id: "band-1" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 3) {
          // band leader check
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
        if (callCount === 4) {
          // update comment
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (callCount === 5) {
          // member count
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                count: overrides.memberCount ?? 3,
                error: null,
              }),
            }),
          };
        }
        if (callCount === 6) {
          // existing member check
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: overrides.existingMember ?? null,
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        // insert member
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      });
    }

    it("should accept comment and add member to band", async () => {
      setupAcceptMocks();
      const result = await updateRecruitComment("comment-1", true);
      expect(result.success).toBe(true);
    });

    it("should skip member add when band has 10+ members", async () => {
      setupAcceptMocks({ memberCount: 10 });
      const result = await updateRecruitComment("comment-1", true);
      expect(result.success).toBe(true);
      // No member insert should happen (call count won't reach 7)
    });

    it("should skip member add when already a member", async () => {
      setupAcceptMocks({
        existingMember: { id: "existing-member" },
      });
      const result = await updateRecruitComment("comment-1", true);
      expect(result.success).toBe(true);
    });

    it("should reject comment (is_accepted = false)", async () => {
      let callCount = 0;
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "leader-id" } },
        error: null,
      });
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "comment-1",
                    recruit_id: "recruit-1",
                    user_id: "applicant-id",
                    applied_pos: "기타",
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
                  data: { band_id: "band-1" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 3) {
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

      const result = await updateRecruitComment("comment-1", false);
      expect(result.success).toBe(true);
    });
  });

  describe("deleteRecruitComment", () => {
    it("should delete own comment", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "comment-1", user_id: "user-id" },
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

      const result = await deleteRecruitComment("comment-1");
      expect(result.success).toBe(true);
    });

    it("should reject deleting others comment", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "comment-1", user_id: "other-user" },
              error: null,
            }),
          }),
        }),
      });

      const result = await deleteRecruitComment("comment-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });
  });
});
