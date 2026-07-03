/**
 * react-hook-form 의 onError(invalid) 핸들러에서 검증 실패를 로깅한다.
 * 개발 환경에서만 출력하며, scope 로 어느 폼에서 발생했는지 식별한다.
 *
 * @param scope - 폼 식별자 (예: "create-jam")
 * @param errors - react-hook-form 이 전달하는 FieldErrors
 */
export function logFormError(scope: string, errors: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${scope}] validation failed`, errors);
  }
}
