const VELOCITY_THRESHOLD = 500; // px/s - 빠른 스와이프 감지
const POSITION_THRESHOLD = 0.4; // 40% 이상 드래그 시 닫기

/**
 * 드래그 제스처 종료 시 바텀시트를 닫을지 복원할지 결정하는 순수 함수.
 *
 * @param velocityY - Y축 드래그 속도 (px/s, 양수 = 아래 방향)
 * @param offsetY - Y축 드래그 오프셋 (px, 양수 = 아래 방향)
 * @param currentHeightPx - 바텀시트의 현재 높이 (px)
 * @returns "close" | "restore"
 */
export function decideGestureAction(
  velocityY: number,
  offsetY: number,
  currentHeightPx: number
): "close" | "restore" {
  // 빠른 아래 스와이프 = 즉시 닫기
  if (velocityY > VELOCITY_THRESHOLD) return "close";

  // 높이가 0이면 닫기 (방어)
  if (currentHeightPx === 0) return "close";

  // 위치 기반 결정: 40% 이상 아래로 드래그되면 닫기
  const draggedDownRatio = offsetY / currentHeightPx;
  return draggedDownRatio > POSITION_THRESHOLD ? "close" : "restore";
}
