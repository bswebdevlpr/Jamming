import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockClient } = vi.hoisted(() => {
  return {
    mockClient: {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "leader-id" } },
          error: null,
        }),
      },
      from: vi.fn(),
    },
  };
});

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));
vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import {
  addBandMember,
  removeBandMember,
  leaveBand,
} from "@/app/api/functions/band/member";
import { PositionEnum } from "@/app/lib/enums/position.enum";

describe("Band Member Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "leader-id" } },
      error: null,
    });
  });

  describe("addBandMember", () => {
    function setupAddMemberMocks(overrides: {
      bandLeaderId?: string;
      memberCount?: number;
      existingMember?: any;
      userBandCount?: number;
      insertError?: any;
    } = {}) {
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
                    leader_id: overrides.bandLeaderId ?? "leader-id",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (callCount === 2) {
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
        if (callCount === 3) {
          // existing check
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
        if (callCount === 4) {
          // user band count
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                count: overrides.userBandCount ?? 2,
                error: null,
              }),
            }),
          };
        }
        // insert
        return {
          insert: vi.fn().mockResolvedValue({
            error: overrides.insertError ?? null,
          }),
        };
      });
    }

    it("should add member successfully", async () => {
      setupAddMemberMocks();
      const result = await addBandMember({
        band_id: "band-1",
        user_id: "new-member-id",
        pos: PositionEnum.Guitar,
        role: "member",
      });
      expect(result.success).toBe(true);
    });

    it("should reject if not band leader", async () => {
      setupAddMemberMocks({ bandLeaderId: "other-leader" });
      const result = await addBandMember({
        band_id: "band-1",
        user_id: "new-member-id",
        pos: PositionEnum.Guitar,
        role: "member",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_BAND_LEADER");
      }
    });

    it("should reject when member limit reached (10)", async () => {
      setupAddMemberMocks({ memberCount: 10 });
      const result = await addBandMember({
        band_id: "band-1",
        user_id: "new-member-id",
        pos: PositionEnum.Guitar,
        role: "member",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("MEMBER_LIMIT_REACHED");
      }
    });

    it("should reject duplicate member", async () => {
      setupAddMemberMocks({ existingMember: { id: "existing-member-id" } });
      const result = await addBandMember({
        band_id: "band-1",
        user_id: "existing-member-id",
        pos: PositionEnum.Guitar,
        role: "member",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("ALREADY_MEMBER");
      }
    });

    it("should reject when user is in 5+ bands", async () => {
      setupAddMemberMocks({ userBandCount: 5 });
      const result = await addBandMember({
        band_id: "band-1",
        user_id: "busy-member-id",
        pos: PositionEnum.Guitar,
        role: "member",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("BAND_LIMIT_REACHED");
      }
    });
  });

  describe("removeBandMember", () => {
    it("should remove a member successfully", async () => {
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
        if (callCount === 2) {
          // member lookup
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "member-1",
                    user_id: "regular-member",
                    role: "member",
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        };
      });

      const result = await removeBandMember("band-1", "member-1");
      expect(result.success).toBe(true);
    });

    it("should not allow removing the leader", async () => {
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
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "leader-member",
                  user_id: "leader-id",
                  role: "leader",
                },
                error: null,
              }),
            }),
          }),
        };
      });

      const result = await removeBandMember("band-1", "leader-member");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
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

      const result = await removeBandMember("band-1", "member-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_BAND_LEADER");
      }
    });
  });

  describe("leaveBand", () => {
    it("should allow regular member to leave", async () => {
      let callCount = 0;
      mockClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
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
        }
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        };
      });

      const result = await leaveBand("band-1");
      expect(result.success).toBe(true);
    });

    it("should not allow leader to leave", async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { leader_id: "leader-id" },
              error: null,
            }),
          }),
        }),
      });

      const result = await leaveBand("band-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });
  });
});
