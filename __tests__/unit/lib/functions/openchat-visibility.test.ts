import { describe, it, expect } from "vitest";

/**
 * jamsession/post/[id]/page.tsx 의 오픈채팅 표시 조건 로직 테스트
 *
 * 조건: jam.openchat && user && (
 *   user.id === jam.user_id ||
 *   jam.jamentry?.some(je => je.user_id === user.id && je.is_allowed === true)
 * )
 */
function isOpenchatVisible(
  jam: { openchat?: string | null; user_id: string; jamentry?: { user_id: string; is_allowed: boolean | null }[] },
  user: { id: string } | null
): boolean {
  return !!(
    jam.openchat &&
    user &&
    (user.id === jam.user_id ||
      jam.jamentry?.some(
        (je) => je.user_id === user.id && je.is_allowed === true
      ))
  );
}

describe("오픈채팅 표시 조건 (Gap C)", () => {
  const baseJam = {
    openchat: "https://open.kakao.com/test",
    user_id: "host-id",
    jamentry: [
      { user_id: "approved-user", is_allowed: true },
      { user_id: "pending-user", is_allowed: null },
      { user_id: "rejected-user", is_allowed: false },
    ],
  };

  describe("표시되는 경우", () => {
    it("호스트에게 표시된다", () => {
      expect(isOpenchatVisible(baseJam, { id: "host-id" })).toBe(true);
    });

    it("승인된 참가자에게 표시된다", () => {
      expect(isOpenchatVisible(baseJam, { id: "approved-user" })).toBe(true);
    });
  });

  describe("표시되지 않는 경우", () => {
    it("비로그인 유저에게 표시되지 않는다", () => {
      expect(isOpenchatVisible(baseJam, null)).toBe(false);
    });

    it("대기 중인 신청자에게 표시되지 않는다", () => {
      expect(isOpenchatVisible(baseJam, { id: "pending-user" })).toBe(false);
    });

    it("거절된 신청자에게 표시되지 않는다", () => {
      expect(isOpenchatVisible(baseJam, { id: "rejected-user" })).toBe(false);
    });

    it("신청하지 않은 유저에게 표시되지 않는다", () => {
      expect(isOpenchatVisible(baseJam, { id: "random-user" })).toBe(false);
    });

    it("openchat이 null이면 표시되지 않는다", () => {
      const jam = { ...baseJam, openchat: null };
      expect(isOpenchatVisible(jam, { id: "host-id" })).toBe(false);
    });

    it("openchat이 빈 문자열이면 표시되지 않는다", () => {
      const jam = { ...baseJam, openchat: "" };
      expect(isOpenchatVisible(jam, { id: "host-id" })).toBe(false);
    });

    it("jamentry가 없어도 호스트에게는 표시된다", () => {
      const jam = { ...baseJam, jamentry: [] };
      expect(isOpenchatVisible(jam, { id: "host-id" })).toBe(true);
    });

    it("jamentry가 undefined여도 호스트에게는 표시된다", () => {
      const jam = { ...baseJam, jamentry: undefined };
      expect(isOpenchatVisible(jam, { id: "host-id" })).toBe(true);
    });
  });
});
