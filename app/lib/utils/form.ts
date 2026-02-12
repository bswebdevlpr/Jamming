/**
 * 폼 관련 유틸리티 함수
 */

/**
 * 배열에서 값을 토글합니다 (추가/제거)
 *
 * @template T - Enum 또는 문자열 타입
 * @param currentValues - 현재 선택된 값 배열
 * @param valueToToggle - 토글할 값
 * @returns 업데이트된 배열
 *
 * @example
 * const genres = ["rock", "jazz"];
 * const newGenres = toggleEnumValue(genres, "pop");  // ["rock", "jazz", "pop"]
 * const removed = toggleEnumValue(newGenres, "rock"); // ["jazz", "pop"]
 */
export function toggleEnumValue<T>(
  currentValues: T[],
  valueToToggle: T
): T[] {
  if (currentValues.includes(valueToToggle)) {
    // 이미 포함되어 있으면 제거
    return currentValues.filter((v) => v !== valueToToggle);
  } else {
    // 없으면 추가
    return [...currentValues, valueToToggle];
  }
}

/**
 * 튜플 타입을 유지하면서 배열에서 값을 토글합니다
 * (Zod 스키마에서 최소 1개 이상 요구하는 경우 사용)
 *
 * @template T - Enum 또는 문자열 타입
 * @param currentValues - 현재 선택된 값 배열 (튜플)
 * @param valueToToggle - 토글할 값
 * @returns 업데이트된 튜플 (최소 1개 보장)
 *
 * @example
 * const genres: [GenreEnum, ...GenreEnum[]] = ["rock"];
 * const newGenres = toggleEnumValueTuple(genres, "jazz");  // ["rock", "jazz"]
 * const stillOne = toggleEnumValueTuple(newGenres, "rock"); // ["jazz"] (마지막 하나 유지)
 */
export function toggleEnumValueTuple<T>(
  currentValues: [T, ...T[]],
  valueToToggle: T
): [T, ...T[]] {
  const filtered = currentValues.filter((v) => v !== valueToToggle);

  // 최소 1개는 유지해야 함 (튜플 타입 보장)
  if (filtered.length === 0) {
    return [valueToToggle] as [T, ...T[]];
  }

  if (currentValues.includes(valueToToggle)) {
    // 제거
    return filtered as [T, ...T[]];
  } else {
    // 추가
    return [...currentValues, valueToToggle] as [T, ...T[]];
  }
}

/**
 * 폼 필드 값의 빈 문자열을 null로 변환합니다
 *
 * @param value - 폼 필드 값
 * @returns 빈 문자열이면 null, 아니면 원본 값
 *
 * @example
 * const description = emptyStringToNull(formData.description);  // "" → null
 */
export function emptyStringToNull(value: string): string | null {
  return value.trim() === "" ? null : value.trim();
}

/**
 * null 또는 undefined를 빈 문자열로 변환합니다 (폼 초기값 설정용)
 *
 * @param value - 데이터베이스 값
 * @returns null/undefined면 빈 문자열, 아니면 원본 값
 *
 * @example
 * <input defaultValue={nullToEmptyString(band.description)} />
 */
export function nullToEmptyString(value: string | null | undefined): string {
  return value ?? "";
}
