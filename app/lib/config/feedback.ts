/**
 * 피드백 기능 설정
 * - 길이 제한, Rate Limiting 정책, 에러 메시지 등 중앙 관리
 */

export const FEEDBACK_CONFIG = {
  /** 피드백 본문 최대 길이 */
  MAX_LENGTH: 100,

  /** Rate Limiting 정책 */
  RATE_LIMIT: {
    /** 시간 창 내 최대 시도 횟수 */
    MAX_ATTEMPTS: 3,
    /** 시간 창 (Upstash Ratelimit 형식: "1 h", "1 m", etc.) */
    WINDOW_DURATION: "1 h" as const,
    /** Redis prefix */
    PREFIX: "ratelimit:feedback" as const,
  },

  /** Rate Limit 식별자 prefix */
  IDENTIFIER_PREFIX: {
    /** 로그인 사용자 */
    USER: "feedback:user" as const,
    /** 비로그인 사용자 (IP 기반) */
    IP: "feedback:ip" as const,
  },

  /** 에러 메시지 */
  ERROR_MESSAGES: {
    /** Rate Limit 초과 */
    RATE_LIMIT_EXCEEDED:
      "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
    /** 검증 실패 (일반) */
    VALIDATION_FAILED: "피드백 전송이 실패했어요. 나중에 다시 시도해주세요.",
    /** 전송 성공 */
    SUCCESS: "피드백 전송이 완료되었어요",
  },
} as const;
