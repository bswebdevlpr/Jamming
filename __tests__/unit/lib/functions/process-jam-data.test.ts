import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id" } },
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

import { getJam } from "@/app/api/functions/read";

function mockJamQuery(jamData: object) {
  mockClient.from.mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: jamData, error: null }),
      }),
    }),
  });
}

describe("processJamData (via getJam)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
  });

  describe("curHeadCnt", () => {
    it("should be 0 when no entries", async () => {
      mockJamQuery({ id: 1, jamentry: [], headcnt_by_pos: [] });
      const result = await getJam(1);
      expect(result.curHeadCnt).toBe(0);
    });

    it("should equal jamentry.length", async () => {
      mockJamQuery({
        id: 1,
        jamentry: [
          { id: 1, jam_id: 1, user_id: "u1", applied_pos: "기타" },
          { id: 2, jam_id: 1, user_id: "u2", applied_pos: "드럼" },
          { id: 3, jam_id: 1, user_id: "u3", applied_pos: "기타" },
        ],
        headcnt_by_pos: [{ pos: "기타", headcnt: 2 }, { pos: "드럼", headcnt: 1 }],
      });
      const result = await getJam(1);
      expect(result.curHeadCnt).toBe(3);
    });
  });

  describe("maxHeadCnt", () => {
    it("should be 0 when headcnt_by_pos is empty", async () => {
      mockJamQuery({ id: 1, jamentry: [], headcnt_by_pos: [] });
      const result = await getJam(1);
      expect(result.maxHeadCnt).toBe(0);
    });

    it("should sum all headcnt values", async () => {
      mockJamQuery({
        id: 1,
        jamentry: [],
        headcnt_by_pos: [
          { pos: "기타", headcnt: 2 },
          { pos: "드럼", headcnt: 1 },
          { pos: "보컬", headcnt: 3 },
        ],
      });
      const result = await getJam(1);
      expect(result.maxHeadCnt).toBe(6);
    });

    it("should handle single position", async () => {
      mockJamQuery({
        id: 1,
        jamentry: [],
        headcnt_by_pos: [{ pos: "기타", headcnt: 4 }],
      });
      const result = await getJam(1);
      expect(result.maxHeadCnt).toBe(4);
    });
  });

  describe("appliedPosDict", () => {
    it("should initialize keys only for positions with headcnt > 0", async () => {
      mockJamQuery({
        id: 1,
        jamentry: [],
        headcnt_by_pos: [
          { pos: "기타", headcnt: 2 },
          { pos: "드럼", headcnt: 0 }, // headcnt 0은 포함 안 됨
          { pos: "보컬", headcnt: 1 },
        ],
      });
      const result = await getJam(1);
      expect(result.appliedPosDict).toEqual({ 기타: 0, 보컬: 0 });
      expect(result.appliedPosDict).not.toHaveProperty("드럼");
    });

    it("should count applied positions from jamentry", async () => {
      mockJamQuery({
        id: 1,
        jamentry: [
          { id: 1, jam_id: 1, user_id: "u1", applied_pos: "기타" },
          { id: 2, jam_id: 1, user_id: "u2", applied_pos: "기타" },
          { id: 3, jam_id: 1, user_id: "u3", applied_pos: "드럼" },
        ],
        headcnt_by_pos: [
          { pos: "기타", headcnt: 2 },
          { pos: "드럼", headcnt: 1 },
        ],
      });
      const result = await getJam(1);
      expect(result.appliedPosDict).toEqual({ 기타: 2, 드럼: 1 });
    });

    it("should count positions not in headcnt_by_pos if applied", async () => {
      // jamentry에 headcnt_by_pos에 없는 포지션이 있어도 카운트
      mockJamQuery({
        id: 1,
        jamentry: [
          { id: 1, jam_id: 1, user_id: "u1", applied_pos: "기타" },
          { id: 2, jam_id: 1, user_id: "u2", applied_pos: "미정" }, // 초기화 안 됨
        ],
        headcnt_by_pos: [{ pos: "기타", headcnt: 2 }],
      });
      const result = await getJam(1);
      expect(result.appliedPosDict["기타"]).toBe(1);
      expect(result.appliedPosDict["미정"]).toBe(1);
    });

    it("should return empty dict when no entries and no positions", async () => {
      mockJamQuery({ id: 1, jamentry: [], headcnt_by_pos: [] });
      const result = await getJam(1);
      expect(result.appliedPosDict).toEqual({});
    });
  });
});
