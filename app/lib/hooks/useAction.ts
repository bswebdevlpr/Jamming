"use client";

import { useCallback, useState } from "react";
import { ErrorCode } from "../errors/custom-error";
import { ActionResult } from "../types/result";

interface ActionError {
  code: ErrorCode;
  message: string;
}

interface UseActionOptions {
  onError?: (error: ActionError) => void;
}

/**
 * useAction - ActionResult를 처리하는 클라이언트 훅
 *
 * Server Action이 ActionResult<T>를 반환하면,
 * 이 훅이 success/fail을 분기하고 에러를 처리합니다.
 *
 * @param action - ActionResult를 반환하는 Server Action
 * @param options - onError 콜백 (ErrorCode별 분기 가능)
 *
 * @example
 * const { execute, isLoading, error } = useAction(createJam, {
 *   onError: (err) => {
 *     if (err.code === ErrorCode.IMAGE_UPLOAD_FAILED) {
 *       alert("이미지 업로드에 실패했습니다.");
 *     } else {
 *       alert(err.message);
 *     }
 *   },
 * });
 *
 * const result = await execute(data);
 * if (result) { // success }
 */
export function useAction<TArgs extends unknown[], TData>(
  action: (...args: TArgs) => Promise<ActionResult<TData>>,
  options?: UseActionOptions
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ActionError | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await action(...args);

        if (result.success === true) {
          return result.data;
        }

        if (result.success === false) {
          setError(result.error);
          options?.onError?.(result.error);
        }
        return null;
      } catch (e) {
        // ActionResult 패턴을 사용하지만, 네트워크 에러 등 예외 상황 처리
        const fallbackError: ActionError = {
          code: ErrorCode.UNEXPECTED,
          message:
            "요청 중 문제가 발생했습니다. 네트워크 연결을 확인해주세요.",
        };
        setError(fallbackError);
        options?.onError?.(fallbackError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [action, options]
  );

  const clearError = useCallback(() => setError(null), []);

  return { execute, isLoading, error, clearError };
}
