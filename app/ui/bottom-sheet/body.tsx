import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import BottomSheetHeader from "./header";
import { useBottomSheet } from "@/app/hooks/useBottomSheet";
import { motion } from "framer-motion";

export const MIN_Y = 10;

interface Props {
  children: ReactNode;
  // ref: RefObject<HTMLDivElement>;
}

const Wrapper = ({
  children,
  pullUp,
}: Props & {
  pullUp: boolean;
}) => {
  const [sheetHeight, setSheetHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSheetHeight(window.innerHeight - 43);
  }, []);

  useEffect(() => {
    const MAX_Y = window.innerHeight;
    if (pullUp)
      ref.current?.style.setProperty("transform", `translateY(-${MAX_Y}px)`);
    else ref.current?.style.setProperty("transform", `translateY(${MAX_Y}px)`);
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

        transition: "transform 0.75s ease-out",
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
  pullUp: boolean;
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
