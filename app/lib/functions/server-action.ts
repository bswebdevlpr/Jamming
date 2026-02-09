import { CustomError, ErrorCode } from "../errors/custom-error";
import { logger } from "../logger";
import { ActionResult, ok, fail } from "../types/result";

/**
 * safeAction - Server Action을 ActionResult 패턴으로 래핑하는 유틸리티
 *
 * - try-catch로 에러를 잡아서 ActionResult로 변환
 * - CustomError는 code와 userMessage를 보존
 * - 일반 에러는 UNEXPECTED로 처리
 * - 모든 에러를 logger를 통해 구조화된 로그로 기록
 *
 * @param operation - 함수 이름 (로깅용)
 * @param fn - 실행할 비동기 함수
 */
export async function safeAction<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const result = await fn();
    return ok(result);
  } catch (e) {
    logger.error(operation, e);

    if (e instanceof CustomError) {
      return fail(e.code, e.userMessage);
    }

    return fail(
      ErrorCode.UNEXPECTED,
      "예기치 못한 문제가 발생했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요."
    );
  }
}
