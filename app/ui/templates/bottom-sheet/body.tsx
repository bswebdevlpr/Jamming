import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import BottomSheetHeader from "./header";
import { useBottomSheet } from "@/app/hooks/useBottomSheet";
import { motion } from "framer-motion";

export type BottomSheetHeight =
  | null
  | "high"
  | "middle"
  | "low"
  | "superLow"
  | number
  | "hidden";

interface Props {
  children: ReactNode;
  width: number;
  height: number;
  pullUp: BottomSheetHeight;
  header?: boolean;
  // ref: RefObject<HTMLDivElement>;
}

export const BOTTOMSHEET_HEIGHT_HIGH = 94.35;
export const BOTTOMSHEET_HEIGHT_MIDDLE = 59.95;
export const BOTTOMSHEET_HEIGHT_LOW = 16.7;
export const BOTTOMSHEET_HEIGHT_SUPER_LOW = 10.5;

const Wrapper = ({ children, width, height, pullUp }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.style.setProperty("display", "flex");
  }, []);

  const [prevDist, setPrevDist] = useState(0);

  useEffect(() => {
    switch (pullUp) {
      case null:
        break;
      case "high":
        ref.current?.style.setProperty(
          "transform",
          `translateY(-${BOTTOMSHEET_HEIGHT_HIGH}%)`
        );
        setPrevDist(BOTTOMSHEET_HEIGHT_HIGH);
        break;
      case "middle":
        ref.current?.style.setProperty(
          "transform",
          `translateY(-${BOTTOMSHEET_HEIGHT_MIDDLE}%)`
        );
        setPrevDist(BOTTOMSHEET_HEIGHT_MIDDLE);
        break;
      case "low":
        ref.current?.style.setProperty(
          "transform",
          `translateY(-${BOTTOMSHEET_HEIGHT_LOW}%)`
        );
        setPrevDist(BOTTOMSHEET_HEIGHT_LOW);
        break;
      case "superLow":
        ref.current?.style.setProperty(
          "transform",
          `translateY(-${BOTTOMSHEET_HEIGHT_SUPER_LOW}%)`
        );
        setPrevDist(BOTTOMSHEET_HEIGHT_SUPER_LOW);
        break;
      case "hidden":
        ref.current?.style.setProperty("transform", `translateY(${prevDist}%)`);
        setPrevDist(0);
        break;
      default:
        ref.current?.style.setProperty("transform", `translateY(-${pullUp}%)`);
        setPrevDist(pullUp);
        break;
    }
  }, [pullUp]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col absolute z-20"
      style={{
        width: `${width}px`,
        height: `${height}px`,

        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "#242426",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",

        transition: "transform 0.75s ease-out",

        display: "none",
      }}>
      {children}
    </motion.div>
  );
};
Wrapper.displayName = "BottomSheetWrapper";

const BottomSheetContent = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      height: "100%",
    }}>
    {children}
  </div>
);

const BottomSheet = ({
  children,
  width,
  height,
  pullUp,
  header = true,
}: Props) => {
  // const { sheet, content } = useBottomSheet();

  return (
    <Wrapper width={width} height={height} pullUp={pullUp}>
      {header && <BottomSheetHeader />}
      <BottomSheetContent>{children}</BottomSheetContent>
    </Wrapper>
  );
};
export default BottomSheet;
