import { CustomError, ErrorContext } from "./errors/custom-error";

/**
 * 구조화된 로깅 시스템
 *
 * - Development: 원본 에러 + 컨텍스트 상세 출력
 * - Production: JSON 형태로 Vercel Logs에 수집 가능한 구조화된 로그
 *
 * 향후 Sentry 등 외부 모니터링 연동 시 이 파일만 수정하면 됩니다.
 */

const isDev = process.env.NODE_ENV === "development";

function formatContext(context: ErrorContext): Record<string, unknown> {
  const formatted: Record<string, unknown> = {};
  if (context.supabaseCode) formatted.supabaseCode = context.supabaseCode;
  if (context.supabaseMessage)
    formatted.supabaseMessage = context.supabaseMessage;
  if (context.supabaseDetails)
    formatted.supabaseDetails = context.supabaseDetails;
  if (context.supabaseHint) formatted.supabaseHint = context.supabaseHint;
  if (context.httpStatus) formatted.httpStatus = context.httpStatus;
  if (context.operation) formatted.operation = context.operation;
  return formatted;
}

export const logger = {
  /**
   * 에러 로깅 - CustomError와 일반 Error 모두 처리
   */
  error(operation: string, error: unknown): void {
    if (error instanceof CustomError) {
      if (isDev) {
        console.error(`[${operation}] ${error.name}: ${error.message}`);
        if (Object.keys(error.context).length > 0) {
          console.error("Context:", formatContext(error.context));
        }
      } else {
        // Production: JSON 구조화 로그 (Vercel Logs에서 검색/필터 가능)
        console.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            level: "error",
            operation,
            errorCode: error.code,
            message: error.message,
            context: formatContext(error.context),
          })
        );
      }
    } else if (error instanceof Error) {
      if (isDev) {
        console.error(`[${operation}] ${error.name}: ${error.message}`);
        if (error.stack) console.error(error.stack);
      } else {
        console.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            level: "error",
            operation,
            errorType: error.name,
            message: error.message,
          })
        );
      }
    } else {
      if (isDev) {
        console.error(`[${operation}] Unknown error:`, error);
      } else {
        console.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            level: "error",
            operation,
            message: String(error),
          })
        );
      }
    }

    // Sentry 연동 포인트:
    // if (!isDev) Sentry.captureException(error, { tags: { operation } });
  },

  /**
   * 경고 로깅
   */
  warn(
    operation: string,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (isDev) {
      console.warn(`[${operation}] ${message}`, context ?? "");
    } else {
      console.warn(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "warn",
          operation,
          message,
          ...(context ?? {}),
        })
      );
    }
  },

  /**
   * 정보 로깅
   */
  info(operation: string, message: string): void {
    if (isDev) {
      console.info(`[${operation}] ${message}`);
    }
    // Production에서는 info 레벨 로그를 생략 (노이즈 방지)
  },
};
