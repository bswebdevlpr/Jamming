import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import BottomSheetHeader from "./header";
import { useBottomSheet } from "@/app/hooks/useBottomSheet";
import { motion } from "framer-motion";

export type BottomSheetHeight = null | "high" | "middle" | "low" | "hidden";

interface Props {
  children: ReactNode;
  // ref: RefObject<HTMLDivElement>;
}

const HIGH_Y = 97.77;
const MIDDLE_Y = 59.95;
const LOW_Y = 0;

const Wrapper = ({
  children,
  pullUp,
}: Props & {
  pullUp: BottomSheetHeight;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [sheetWidth, setSheetWidth] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);

  const [prevDist, setPrevDist] = useState(0);

  useEffect(() => {
    setSheetWidth(document.body.offsetWidth);
    setSheetHeight(window.innerHeight);
    ref.current?.style.setProperty("display", "flex");
  }, []);

  useEffect(() => {
    switch (pullUp) {
      case "high":
        ref.current?.style.setProperty("transform", `translateY(-${HIGH_Y}vh)`);
        setPrevDist(HIGH_Y);
        break;
      case "middle":
        ref.current?.style.setProperty(
          "transform",
          `translateY(-${MIDDLE_Y}vh)`
        );
        setPrevDist(MIDDLE_Y);
        break;
      case "low":
        ref.current?.style.setProperty("transform", `translateY(-${LOW_Y}vh)`);
        setPrevDist(LOW_Y);
        break;
      case "hidden":
        ref.current?.style.setProperty(
          "transform",
          `translateY(${prevDist}vh)`
        );
        setPrevDist(0);
        break;
    }
  }, [pullUp]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col absolute z-20"
      style={{
        width: `${sheetWidth}px`,
        height: `${sheetHeight}px`,

        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "#242426",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",

        transition: "transform 0.75s ease-out",

        display: "none",
      }}
    >
      {children}
    </motion.div>
  );
};
Wrapper.displayName = "BottomSheetWrapper";

const BottomSheetContent = ({ children }: Props) => (
  <div
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
  pullUp,
}: {
  children: ReactNode;
  pullUp: BottomSheetHeight;
}) => {
  // const { sheet, content } = useBottomSheet();

  return (
    <Wrapper pullUp={pullUp}>
      <BottomSheetHeader />
      <BottomSheetContent>{children}</BottomSheetContent>
    </Wrapper>
  );
};
export default BottomSheet;
