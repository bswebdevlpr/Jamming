import { ReactNode, memo, useCallback, useEffect, useMemo } from "react";
import BottomSheetHeader from "./header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useBottomSheetStore } from "@/app/stores";
import { useShallow } from "zustand/react/shallow";
import {
  useBottomSheetGesture,
  springConfig,
  closeSpringConfig,
} from "./hooks/useBottomSheetGesture";
import { BottomSheetHeight } from "./types";
import { getHeightPercent } from "./utils/height";
import {
  BOTTOM_PADDING_OFFSET_VH,
  DRAG_OVERSCROLL_TOP_PX,
} from "./utils/constants";

// re-export for backward compatibility
export type { BottomSheetHeight } from "./types";
export {
  BOTTOMSHEET_HEIGHT_HIGH,
  BOTTOMSHEET_HEIGHT_MIDDLE,
  BOTTOMSHEET_HEIGHT_ROW_2,
  BOTTOMSHEET_HEIGHT_ROW_1,
} from "./utils/height";

interface Props {
  width: number;
  height: number;
}

interface WrapperProps {
  children: ReactNode;
  width: number;
  height: number;
  pullUp: BottomSheetHeight;
  onClose: () => void;
}

const Wrapper = ({
  children,
  width,
  height,
  pullUp,
  onClose,
}: WrapperProps) => {
  const { controls, currentHeightPx, handleDragEnd } = useBottomSheetGesture({
    viewportHeight: height,
    currentLocation: pullUp,
    onClose,
  });

  // pullUp 변경 시 애니메이션
  useEffect(() => {
    if (pullUp === null || pullUp === "hidden") {
      controls.start({
        y: 0,
        transition: closeSpringConfig,
      });
    } else {
      controls.start({
        y: -currentHeightPx,
        transition: springConfig,
      });
    }
  }, [pullUp, currentHeightPx, controls]);

  // 드래그 제약 조건
  const dragConstraints = useMemo(
    () => ({
      top: -currentHeightPx - DRAG_OVERSCROLL_TOP_PX, // 약간 위로 과도 드래그 허용
      bottom: height, // 화면 아래까지
    }),
    [currentHeightPx, height]
  );

  // 패딩 계산
  const heightPercent = getHeightPercent(pullUp);
  const paddingBottom =
    pullUp && pullUp !== "hidden"
      ? `${100 - heightPercent + BOTTOM_PADDING_OFFSET_VH}vh`
      : `${BOTTOM_PADDING_OFFSET_VH}vh`;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="바텀시트"
      drag="y"
      dragConstraints={dragConstraints}
      dragElastic={{ top: 0.1, bottom: 0.2 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ y: 0 }}
      className="flex flex-col absolute left-0 right-0 z-30 touch-none"
      style={{
        margin: "0 auto",
        width: `${width}px`,
        height: `${height}px`,
        top: `${height}px`,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "var(--deep-bg)",
        boxShadow: "var(--shadow-bottom-sheet)",
        paddingBottom,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
};
Wrapper.displayName = "BottomSheetWrapper";

const BottomSheetContent = memo(({ children }: { children: ReactNode }) => (
  <div
    className="touch-auto"
    style={{
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      flex: 1,
      minHeight: 0,
    }}
  >
    {children}
  </div>
));
BottomSheetContent.displayName = "BottomSheetContent";

const BottomSheet = ({ width, height }: Props) => {
  const { children, location, header } = useBottomSheetStore(
    useShallow((state) => ({
      children: state.children,
      location: state.location,
      header: state.header,
    }))
  );
  const closeBottomSheet = useBottomSheetStore((state) => state.close);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 라우트 변경 시 바텀시트 상태 초기화
  useEffect(() => {
    return () => {
      closeBottomSheet();
    };
  }, [pathname, searchParams, closeBottomSheet]);

  const handleClose = useCallback(() => {
    closeBottomSheet();
  }, [closeBottomSheet]);

  const isOpen = location && location !== "hidden";

  // ESC 키로 바텀시트 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // 뷰포트 크기가 0이면 렌더링하지 않음 (초기 로딩 또는 비정상 상태)
  if (width === 0 || height === 0) return null;

  return (
    <>
      {/* 백드롭 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            role="presentation"
            aria-label="바텀시트 닫기"
            className="absolute w-full h-full top-0 left-0 right-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "var(--backdrop)",
              maxWidth: "var(--max-width)",
              margin: "0 auto",
            }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* 바텀시트 */}
      <AnimatePresence>
        {isOpen && (
          <Wrapper
            key="sheet"
            width={width}
            height={height}
            pullUp={location}
            onClose={handleClose}
          >
            {header && <BottomSheetHeader />}
            <BottomSheetContent>{children}</BottomSheetContent>
          </Wrapper>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomSheet;
