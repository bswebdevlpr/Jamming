import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Upstash Redis 클라이언트 초기화
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * 닉네임 중복 검사 Rate Limiter
 * - 분당 10회 제한
 * - Sliding Window 방식
 */
export const nicknameCheckLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:nickname",
});

/**
 * 이메일 인증 (로그인/가입) Rate Limiter
 * - 분당 5회 제한
 * - Sliding Window 방식
 */
export const emailAuthLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:email",
});

/**
 * OAuth 인증 (카카오/구글) Rate Limiter
 * - 분당 5회 제한
 * - Sliding Window 방식
 */
export const oauthLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:oauth",
});

/**
 * 클라이언트 IP 주소 가져오기
 * - Vercel/Next.js 환경에서 x-forwarded-for 헤더 사용
 * - 로컬 개발 환경에서는 fallback 제공
 */
export function getClientIP(request?: Request): string {
  if (!request) {
    // Server Action에서 호출된 경우, 임시 식별자 사용
    // 실제 프로덕션에서는 middleware에서 IP를 헤더로 전달하는 방식 권장
    return "server-action";
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

  return ip;
}
