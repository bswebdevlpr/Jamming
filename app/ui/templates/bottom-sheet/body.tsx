import { ReactNode, useContext, useEffect, useRef, useMemo } from "react";
import BottomSheetHeader from "./header";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { BottomSheetContext } from "@/app/lib/interfaces/global.interface";
import { usePathname, useSearchParams } from "next/navigation";
import { globalContext } from "@/app/(pages)/context";
import {
  useBottomSheetGesture,
  springConfig,
  closeSpringConfig,
} from "./hooks/useBottomSheetGesture";

export type BottomSheetHeight =
  | null
  | "high"
  | "middle"
  | "row-2"
  | "row-1"
  | number
  | "hidden";

interface Props {
  children: ReactNode;
  width: number;
  height: number;
  pullUp: BottomSheetHeight;
  setPullUp?: (input: Partial<BottomSheetContext>) => void;
  header?: boolean;
}

const DEFAULT_BUTTON_HEIGHT = 1;

export const BOTTOMSHEET_HEIGHT_HIGH = 94.35;
export const BOTTOMSHEET_HEIGHT_MIDDLE = 59.95;
export const BOTTOMSHEET_HEIGHT_ROW_2 = 21.6;
export const BOTTOMSHEET_HEIGHT_ROW_1 = 14;

// 높이 퍼센트 계산
const getHeightPercent = (location: BottomSheetHeight): number => {
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
};

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
      top: -currentHeightPx - 50, // 약간 위로 과도 드래그 허용
      bottom: height, // 화면 아래까지
    }),
    [currentHeightPx, height]
  );

  // 패딩 계산
  const heightPercent = getHeightPercent(pullUp);
  const paddingBottom =
    pullUp && pullUp !== "hidden"
      ? `${100 - heightPercent + DEFAULT_BUTTON_HEIGHT}vh`
      : `${DEFAULT_BUTTON_HEIGHT}vh`;

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
  const { bottomSheet } = useContext(globalContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 라우트 변경 시 바텀시트 상태 초기화
  useEffect(() => {
    return () => {
      bottomSheet.set({
        children: null,
        location: null,
        header: false,
      });
    };
  }, [pathname, searchParams]);

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
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
