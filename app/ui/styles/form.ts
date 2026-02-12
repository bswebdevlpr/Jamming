/**
 * 폼 관련 공용 스타일 상수
 *
 * 밴드 생성/수정, 구인글 작성 등에서 공통으로 사용되는 스타일을 정의합니다.
 */

import { CSSProperties } from "react";

/**
 * Input 필드 기본 스타일
 *
 * @example
 * <input type="text" style={INPUT_STYLE} />
 * <textarea style={INPUT_STYLE} />
 * <select style={INPUT_STYLE}>...</select>
 */
export const INPUT_STYLE: CSSProperties = {
  background: "#242426",
  border: "1px solid #323234",
  borderRadius: "8px",
  padding: "10px 12px",
  color: "#ededed",
  fontFamily: "SUIT-BODY",
  fontSize: "16px", // iOS 자동 확대 방지
} as const;

/**
 * Label 텍스트 기본 스타일
 *
 * @example
 * <label style={LABEL_STYLE}>밴드명</label>
 */
export const LABEL_STYLE: CSSProperties = {
  fontFamily: "SUIT-TITLE",
  fontSize: "0.875rem",
  color: "#E5E5E9",
} as const;

/**
 * 에러 메시지 스타일
 *
 * @example
 * {errors.name && <p style={ERROR_TEXT_STYLE}>{errors.name.message}</p>}
 */
export const ERROR_TEXT_STYLE: CSSProperties = {
  fontFamily: "SUIT-BODY",
  fontSize: "0.75rem",
  color: "#FF3E2F",
  marginTop: "4px",
} as const;

/**
 * 선택 버튼 기본 스타일 (장르, 레벨 등)
 *
 * @example
 * <button style={SELECTION_BUTTON_STYLE}>락</button>
 */
export const SELECTION_BUTTON_BASE_STYLE: CSSProperties = {
  padding: "8px 16px",
  borderRadius: "8px",
  fontFamily: "SUIT-BODY",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
} as const;

/**
 * 선택되지 않은 버튼 스타일
 */
export const SELECTION_BUTTON_INACTIVE_STYLE: CSSProperties = {
  ...SELECTION_BUTTON_BASE_STYLE,
  border: "1px solid #444447",
  background: "#323234",
  color: "#9F9FA2",
} as const;

/**
 * 선택된 버튼 스타일
 */
export const SELECTION_BUTTON_ACTIVE_STYLE: CSSProperties = {
  ...SELECTION_BUTTON_BASE_STYLE,
  border: "1px solid #A3FF0C",
  background: "rgba(163, 255, 12, 0.16)",
  color: "#A3FF0C",
} as const;
