import { describe, it, expect, vi, beforeEach } from "vitest";

// --- hoisted mocks ---
const { mockClient, mockCreateNotification } = vi.hoisted(() => ({
  mockClient: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "host-user-id" } },
        error: null,
      }),
    },
    from: vi.fn(),
    rpc: vi.fn(),
  },
  mockCreateNotification: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));
vi.mock("@/app/lib/functions/validate", () => ({
  sanitize: vi.fn(async (text: string) => text),
}));
vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));
vi.mock("@/app/api/functions/notification", () => ({
  createNotification: mockCreateNotification,
}));

import { createJamEntry } from "@/app/api/functions/create";
import { allowEntry, refuseEntry } from "@/app/(pages)/(only-user)/myact/[id]/functions/fetch";

// --- helpers ---

/** 순차적으로 다른 mock 반환값을 설정 */
function setupFromCalls(calls: Record<string, any>[]) {
  let callIndex = 0;
  mockClient.from.mockImplementation(() => {
    const result = calls[callIndex] ?? calls[calls.length - 1];
    callIndex++;
    return result;
  });
}

/** chainable query builder 생성 */
function chainable(terminal: Record<string, any> = {}) {
  const chain: Record<string, any> = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...terminal,
  };
  // chainable methods return `chain`
  for (const key of ["select", "insert", "update", "delete", "eq", "neq"]) {
    if (!terminal[key]) chain[key] = vi.fn().mockReturnValue(chain);
  }
  return chain;
}

describe("Jam Notification Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "host-user-id" } },
      error: null,
    });
  });

  // ===== Gap A: createJamEntry → 호스트 알림 =====
  describe("createJamEntry - 호스트 알림 (Gap A)", () => {
    const input = {
      user_id: "applicant-id",
      jam_id: 1,
      appeal: "잘 부탁드립니다",
      applied_pos: "기타",
    };

    it("신청 성공 시 호스트에게 jam_apply 알림을 전송한다", async () => {
      setupFromCalls([
        // 1) jamentry insert
        chainable({ insert: vi.fn().mockResolvedValue({ error: null }) }),
        // 2) jamsession select (호스트 조회)
        chainable({
          single: vi.fn().mockResolvedValue({
            data: { user_id: "host-user-id", title: "주말 잼" },
            error: null,
          }),
        }),
        // 3) user select (신청자 닉네임)
        chainable({
          single: vi.fn().mockResolvedValue({
            data: { nickname: "기타리스트" },
            error: null,
          }),
        }),
      ]);

      const result = await createJamEntry(input);

      expect(result.success).toBe(true);
      expect(mockCreateNotification).toHaveBeenCalledWith(
        "host-user-id",
        "jam_apply",
        "새로운 잼 신청이 도착했어요",
        "기타리스트님이 '주말 잼'에 참가 신청했어요",
        { jam_id: 1, applicant_id: "applicant-id" }
      );
    });

    it("자기 자신의 잼에 신청하면 알림을 보내지 않는다 (self-notification 방지)", async () => {
      const selfInput = { ...input, user_id: "host-user-id" };

      setupFromCalls([
        chainable({ insert: vi.fn().mockResolvedValue({ error: null }) }),
        chainable({
          single: vi.fn().mockResolvedValue({
            data: { user_id: "host-user-id", title: "주말 잼" },
            error: null,
          }),
        }),
        chainable({
          single: vi.fn().mockResolvedValue({
            data: { nickname: "테스트유저" },
            error: null,
          }),
        }),
      ]);

      const result = await createJamEntry(selfInput);

      expect(result.success).toBe(true);
      expect(mockCreateNotification).not.toHaveBeenCalled();
    });

    it("알림 전송 실패해도 신청 자체는 성공한다", async () => {
      setupFromCalls([
        chainable({ insert: vi.fn().mockResolvedValue({ error: null }) }),
        // jamsession/user 조회에서 에러 발생
        chainable({
          single: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      ]);

      const result = await createJamEntry(input);

      expect(result.success).toBe(true);
    });

    it("닉네임이 없으면 '누군가'로 폴백한다", async () => {
      setupFromCalls([
        chainable({ insert: vi.fn().mockResolvedValue({ error: null }) }),
        chainable({
          single: vi.fn().mockResolvedValue({
            data: { user_id: "host-user-id", title: "주말 잼" },
            error: null,
          }),
        }),
        chainable({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      ]);

      const result = await createJamEntry(input);

      expect(result.success).toBe(true);
      expect(mockCreateNotification).toHaveBeenCalledWith(
        "host-user-id",
        "jam_apply",
        "새로운 잼 신청이 도착했어요",
        "누군가님이 '주말 잼'에 참가 신청했어요",
        expect.any(Object)
      );
    });
  });

  // ===== Gap B: allowEntry / refuseEntry → 신청자 알림 =====
  describe("allowEntry - 승인 알림 (Gap B)", () => {
    beforeEach(() => {
      // validateAuth: rpc returns true
      mockClient.rpc.mockResolvedValue({ data: true, error: null });
    });

    it("승인 시 신청자에게 jam_accepted 알림을 전송한다", async () => {
      let fromCallIndex = 0;
      mockClient.from.mockImplementation((table: string) => {
        fromCallIndex++;
        // 1) jamentry.update (메인 동작)
        if (fromCallIndex === 1) {
          return chainable({
            select: vi.fn().mockResolvedValue({ error: null }),
          });
        }
        // 2) jamentry.select (adjustBpm - entry lookup)
        if (fromCallIndex === 2) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { user_id: "applicant-id" },
              error: null,
            }),
          });
        }
        // 3) user.select (adjustBpm - bpm lookup)
        if (fromCallIndex === 3) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { bpm: 100 },
              error: null,
            }),
          });
        }
        // 4) user.update (adjustBpm - bpm update)
        if (fromCallIndex === 4) {
          return chainable();
        }
        // 5) jamentry.select (notifyApplicant - entry lookup)
        if (fromCallIndex === 5) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { user_id: "applicant-id", jam_id: 1 },
              error: null,
            }),
          });
        }
        // 6) jamsession.select (notifyApplicant - title lookup)
        if (fromCallIndex === 6) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { title: "주말 잼" },
              error: null,
            }),
          });
        }
        return chainable();
      });

      const result = await allowEntry(1);

      expect(result.success).toBe(true);
      expect(mockCreateNotification).toHaveBeenCalledWith(
        "applicant-id",
        "jam_accepted",
        "잼 신청이 수락되었어요!",
        "'주말 잼' 참가가 확정되었어요",
        { jam_id: 1 }
      );
    });

    it("승인 성공하지만 알림 실패해도 결과는 성공이다", async () => {
      let fromCallIndex = 0;
      mockClient.from.mockImplementation(() => {
        fromCallIndex++;
        if (fromCallIndex === 1) {
          return chainable({
            select: vi.fn().mockResolvedValue({ error: null }),
          });
        }
        // adjustBpm + notifyApplicant 모두 실패
        return chainable({
          single: vi.fn().mockRejectedValue(new Error("DB error")),
        });
      });

      const result = await allowEntry(1);
      expect(result.success).toBe(true);
    });
  });

  describe("refuseEntry - 거절 알림 (Gap B)", () => {
    beforeEach(() => {
      mockClient.rpc.mockResolvedValue({ data: true, error: null });
    });

    it("거절 시 신청자에게 jam_rejected 알림을 전송한다", async () => {
      let fromCallIndex = 0;
      mockClient.from.mockImplementation((table: string) => {
        fromCallIndex++;
        // 1) jamentry.update (메인 동작)
        if (fromCallIndex === 1) {
          return chainable({
            eq: vi.fn().mockResolvedValue({ error: null }),
          });
        }
        // 2) jamentry.select (adjustBpm - entry lookup)
        if (fromCallIndex === 2) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { user_id: "applicant-id" },
              error: null,
            }),
          });
        }
        // 3) user.select (adjustBpm - bpm lookup)
        if (fromCallIndex === 3) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { bpm: 100 },
              error: null,
            }),
          });
        }
        // 4) user.update (adjustBpm - bpm update)
        if (fromCallIndex === 4) {
          return chainable();
        }
        // 5) jamentry.select (notifyApplicant - entry lookup)
        if (fromCallIndex === 5) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { user_id: "applicant-id", jam_id: 1 },
              error: null,
            }),
          });
        }
        // 6) jamsession.select (notifyApplicant - title lookup)
        if (fromCallIndex === 6) {
          return chainable({
            single: vi.fn().mockResolvedValue({
              data: { title: "펑크 잼" },
              error: null,
            }),
          });
        }
        return chainable();
      });

      const result = await refuseEntry(1);

      expect(result.success).toBe(true);
      expect(mockCreateNotification).toHaveBeenCalledWith(
        "applicant-id",
        "jam_rejected",
        "잼 신청 결과 안내",
        "'펑크 잼' 신청이 반려되었어요",
        { jam_id: 1 }
      );
    });

    it("notifyApplicant에서 entry가 없으면 알림을 건너뛴다", async () => {
      let fromCallIndex = 0;
      mockClient.from.mockImplementation(() => {
        fromCallIndex++;
        if (fromCallIndex === 1) {
          return chainable({
            eq: vi.fn().mockResolvedValue({ error: null }),
          });
        }
        // adjustBpm / notifyApplicant 에서 entry 조회 결과 null
        return chainable({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        });
      });

      const result = await refuseEntry(1);

      expect(result.success).toBe(true);
      expect(mockCreateNotification).not.toHaveBeenCalled();
    });
  });
});
