import { ErrorCode } from "../errors/custom-error";

/**
 * ActionResult<T> - Server Action의 타입 안전한 반환 타입
 *
 * Next.js Server Action에서 throw를 사용하면 직렬화 시 에러 정보가 손실되므로,
 * 명시적인 성공/실패 반환 패턴을 사용합니다.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: { code: ErrorCode; message: string } };

/**
 * 성공 결과 생성
 */
export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * 실패 결과 생성
 */
export function fail(code: ErrorCode, message: string): ActionResult<never> {
  return { success: false, error: { code, message } };
}

/**
 * 타입 가드: 에러 결과인지 확인
 */
export function isError<T>(
  result: ActionResult<T>
): result is { success: false; error: { code: ErrorCode; message: string } } {
  return !result.success;
}
