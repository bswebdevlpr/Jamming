import { useCallback, useMemo } from "react";
import { PanInfo, useAnimation } from "framer-motion";
import { BottomSheetHeight } from "../types";
import { heightToPixels } from "../utils/height";
import { decideGestureAction } from "../utils/gesture-decision";

// 스프링 애니메이션 설정
export const springConfig = {
  type: "spring" as const,
  damping: 30,
  stiffness: 300,
  mass: 0.8,
};

// 닫기 애니메이션 (더 빠름)
export const closeSpringConfig = {
  type: "spring" as const,
  damping: 40,
  stiffness: 400,
  mass: 0.5,
};

interface UseBottomSheetGestureProps {
  viewportHeight: number;
  currentLocation: BottomSheetHeight;
  onClose: () => void;
}

export function useBottomSheetGesture({
  viewportHeight,
  currentLocation,
  onClose,
}: UseBottomSheetGestureProps) {
  const controls = useAnimation();

  // 현재 위치의 픽셀 값
  const currentHeightPx = useMemo(
    () => heightToPixels(currentLocation, viewportHeight),
    [currentLocation, viewportHeight]
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const action = decideGestureAction(
        info.velocity.y,
        info.offset.y,
        currentHeightPx
      );

      if (action === "close") {
        controls
          .start({ y: 0, transition: closeSpringConfig })
          .then(() => onClose());
      } else {
        // 원위치로 복귀
        controls.start({
          y: -currentHeightPx,
          transition: springConfig,
        });
      }
    },
    [currentHeightPx, controls, onClose]
  );

  return {
    controls,
    currentHeightPx,
    handleDragEnd,
  };
}
