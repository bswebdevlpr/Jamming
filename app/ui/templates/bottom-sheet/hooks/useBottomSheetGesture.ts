import { useCallback, useMemo } from "react";
import { PanInfo, useAnimation } from "framer-motion";
import { BottomSheetHeight } from "../types";
import { heightToPixels } from "../utils/height";
import { CLOSE_ANIMATION_DURATION_MS } from "../utils/constants";

const VELOCITY_THRESHOLD = 500; // px/s - 빠른 스와이프 감지
const POSITION_THRESHOLD = 0.4; // 40% 이상 드래그 시 닫기

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
      const { velocity, offset } = info;

      // 빠른 아래 스와이프 = 즉시 닫기
      if (velocity.y > VELOCITY_THRESHOLD) {
        controls.start({
          y: 0,
          transition: closeSpringConfig,
        });
        setTimeout(() => onClose(), CLOSE_ANIMATION_DURATION_MS);
        return;
      }

      // 위치 기반 결정: 40% 이상 아래로 드래그되면 닫기
      const draggedDownRatio = offset.y / currentHeightPx;

      if (draggedDownRatio > POSITION_THRESHOLD) {
        // 닫기
        controls.start({
          y: 0,
          transition: closeSpringConfig,
        });
        setTimeout(() => onClose(), CLOSE_ANIMATION_DURATION_MS);
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

  // 위치가 변경될 때 애니메이션
  const animateToLocation = useCallback(
    (location: BottomSheetHeight) => {
      if (location === null || location === "hidden") {
        return controls.start({
          y: 0,
          transition: closeSpringConfig,
        });
      }

      const targetY = heightToPixels(location, viewportHeight);
      return controls.start({
        y: -targetY,
        transition: springConfig,
      });
    },
    [controls, viewportHeight]
  );

  return {
    controls,
    currentHeightPx,
    handleDragEnd,
    animateToLocation,
    springConfig,
    closeSpringConfig,
  };
}
