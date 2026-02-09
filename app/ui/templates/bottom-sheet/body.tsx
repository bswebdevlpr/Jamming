import { ReactNode, useEffect, useMemo } from "react";
import BottomSheetHeader from "./header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useBottomSheetStore } from "@/app/stores";
import {
  useBottomSheetGesture,
  springConfig,
  closeSpringConfig,
} from "./hooks/useBottomSheetGesture";
import { BottomSheetHeight, BottomSheetInput } from "./types";
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
  children: ReactNode;
  width: number;
  height: number;
  pullUp: BottomSheetHeight;
  setPullUp?: (input: BottomSheetInput) => void;
  header?: boolean;
}

interface WrapperProps extends Props {
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
      drag="y"
      dragConstraints={dragConstraints}
      dragElastic={{ top: 0.1, bottom: 0.2 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ y: 0 }}
      className="flex flex-col absolute z-30 touch-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: `${height}px`,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "#242426",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
        paddingBottom,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
};
Wrapper.displayName = "BottomSheetWrapper";

const BottomSheetContent = ({ children }: { children: ReactNode }) => (
  <div
    className="touch-auto"
    style={{
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      height: "100%",
    }}
  >
    {children}
  </div>
);

const BottomSheet = ({
  children,
  width,
  height,
  pullUp,
  setPullUp,
  header = false,
}: Props) => {
  const closeBottomSheet = useBottomSheetStore((state) => state.close);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 라우트 변경 시 바텀시트 상태 초기화
  useEffect(() => {
    return () => {
      closeBottomSheet();
    };
  }, [pathname, searchParams, closeBottomSheet]);

  const handleClose = () => {
    setPullUp?.({
      location: "hidden",
    });
  };

  const isOpen = pullUp && pullUp !== "hidden";

  return (
    <>
      {/* 백드롭 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="absolute w-full h-full top-0 left-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
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
            pullUp={pullUp}
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
