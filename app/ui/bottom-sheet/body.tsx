import { ReactNode, RefObject, useEffect, useState } from "react";
import BottomSheetHeader from "./header";
import { useBottomSheet } from "@/app/hooks/useBottomSheet";
import { motion } from "framer-motion";

export const MIN_Y = 10;

interface Props {
  children: ReactNode;
  ref: RefObject<HTMLDivElement>;
}

const Wrapper = ({
  children,
  ref,
  pullUp,
}: Props & {
  pullUp: boolean;
}) => {
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    setSheetHeight(window.innerHeight - 43);
  }, []);

  useEffect(() => {
    if (pullUp) {
      const MAX_Y = window.innerHeight;

      ref.current?.style.setProperty("transition", `transform 1s ease-out`);
      requestAnimationFrame(() => {
        ref.current?.style.setProperty("display", "flex");
        ref.current?.style.setProperty("transform", `translateY(-${MAX_Y}px)`);
      });
    } else {
      ref.current?.style.setProperty("display", "none");
    }
  }, [pullUp]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col absolute z-20"
      style={{
        top: `${sheetHeight}px`,

        width: "100%",

        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "#242426",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
        height: `${sheetHeight}px`,

        transition: "transform 150ms ease-out",

        display: "none",
      }}
    >
      {children}
    </motion.div>
  );
};
Wrapper.displayName = "BottomSheetWrapper";

const BottomSheetContent = ({ ref, children }: Props) => (
  <div
    style={{
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      height: "100%",
    }}
    ref={ref}
  >
    {children}
  </div>
);

const BottomSheet = ({
  children,
  pullUp,
}: {
  children: ReactNode;
  pullUp: boolean;
}) => {
  const { sheet, content } = useBottomSheet();

  return (
    <Wrapper ref={sheet} pullUp={pullUp}>
      <BottomSheetHeader />
      <BottomSheetContent ref={content}>{children}</BottomSheetContent>
    </Wrapper>
  );
};
export default BottomSheet;
