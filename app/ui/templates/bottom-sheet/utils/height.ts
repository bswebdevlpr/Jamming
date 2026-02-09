import { BottomSheetHeight } from "../types";

export const BOTTOMSHEET_HEIGHT_HIGH = 94.35;
export const BOTTOMSHEET_HEIGHT_MIDDLE = 59.95;
export const BOTTOMSHEET_HEIGHT_ROW_2 = 21.6;
export const BOTTOMSHEET_HEIGHT_ROW_1 = 14;

/** BottomSheetHeight 를 퍼센트(0~100) 값으로 변환 */
export function getHeightPercent(location: BottomSheetHeight): number {
  if (location === null || location === "hidden") return 0;
  if (typeof location === "number") return location;

  switch (location) {
    case "high":
      return BOTTOMSHEET_HEIGHT_HIGH;
    case "middle":
      return BOTTOMSHEET_HEIGHT_MIDDLE;
    case "row-2":
      return BOTTOMSHEET_HEIGHT_ROW_2;
    case "row-1":
      return BOTTOMSHEET_HEIGHT_ROW_1;
    default:
      return 0;
  }
}

/** BottomSheetHeight 를 뷰포트 기준 픽셀값으로 변환 */
export function heightToPixels(
  location: BottomSheetHeight,
  viewportHeight: number
): number {
  return (viewportHeight * getHeightPercent(location)) / 100;
}
