import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import BottomSheetHeader from "./header";
import { motion } from "framer-motion";
import _ from "lodash";
import { BottomSheetContext } from "@/app/lib/interfaces/global.interface";
import { usePathname, useSearchParams } from "next/navigation";
import { globalContext } from "@/app/(pages)/context";

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
  // ref: RefObject<HTMLDivElement>;
}

const DEFAULT_BUTTON_HEIGHT = 1;

export const BOTTOMSHEET_HEIGHT_HIGH = 94.35;
export const BOTTOMSHEET_HEIGHT_MIDDLE = 59.95;
export const BOTTOMSHEET_HEIGHT_ROW_2 = 21.6;
export const BOTTOMSHEET_HEIGHT_ROW_1 = 14;

const Wrapper = ({ children, width, height, pullUp }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [prevDist, setPrevDist] = useState(0);

  useEffect(() => {
    if (ref.current)
      switch (pullUp) {
        case null:
          break;
        case "high":
          ref.current?.style.setProperty("display", "flex");

          setTimeout(() => {
            if (!ref.current) return;

            ref.current?.style.setProperty(
              "transform",
              `translateY(-${BOTTOMSHEET_HEIGHT_HIGH}%)`
            );
            ref.current?.style.setProperty(
              "padding-bottom",
              `${100 - BOTTOMSHEET_HEIGHT_HIGH + DEFAULT_BUTTON_HEIGHT}vh`
            );
            setPrevDist(BOTTOMSHEET_HEIGHT_HIGH);

            setTimeout(() => {
              ref.current!.style.setProperty("user-select", "auto");
            }, 750);
          }, 0);
          break;
        case "middle":
          ref.current?.style.setProperty("display", "flex");

          setTimeout(() => {
            if (!ref.current) return;

            ref.current?.style.setProperty(
              "transform",
              `translateY(-${BOTTOMSHEET_HEIGHT_MIDDLE}%)`
            );
            ref.current?.style.setProperty(
              "padding-bottom",
              `${100 - BOTTOMSHEET_HEIGHT_MIDDLE + DEFAULT_BUTTON_HEIGHT}vh`
            );
            setPrevDist(BOTTOMSHEET_HEIGHT_MIDDLE);

            setTimeout(() => {
              ref.current!.style.setProperty("user-select", "auto");
            }, 750);
          }, 0);
          break;
        case "row-2":
          ref.current?.style.setProperty("display", "flex");

          setTimeout(() => {
            if (!ref.current) return;

            ref.current?.style.setProperty(
              "transform",
              `translateY(-${BOTTOMSHEET_HEIGHT_ROW_2}%)`
            );
            ref.current?.style.setProperty(
              "padding-bottom",
              `${100 - BOTTOMSHEET_HEIGHT_ROW_2 + DEFAULT_BUTTON_HEIGHT}vh`
            );
            setPrevDist(BOTTOMSHEET_HEIGHT_ROW_2);

            setTimeout(() => {
              ref.current!.style.setProperty("user-select", "auto");
            }, 750);
          }, 0);
          break;
        case "row-1":
          ref.current?.style.setProperty("display", "flex");

          setTimeout(() => {
            if (!ref.current) return;

            ref.current?.style.setProperty(
              "transform",
              `translateY(-${BOTTOMSHEET_HEIGHT_ROW_1}%)`
            );
            ref.current?.style.setProperty(
              "padding-bottom",
              `${100 - BOTTOMSHEET_HEIGHT_ROW_1 + DEFAULT_BUTTON_HEIGHT}vh`
            );
            setPrevDist(BOTTOMSHEET_HEIGHT_ROW_1);

            setTimeout(() => {
              ref.current!.style.setProperty("user-select", "auto");
            }, 750);
          }, 0);
          break;
        case "hidden":
          ref.current?.style.setProperty("user-select", "none");
          ref.current?.style.setProperty(
            "transform",
            `translateY(${prevDist}%)`
          );
          ref.current.style.setProperty(
            "padding-bottom",
            `${DEFAULT_BUTTON_HEIGHT}%`
          );
          setPrevDist(0);

          setTimeout(() => {
            if (!ref.current) return;
            ref.current.style.setProperty("display", "none");
          }, 750); // padding-bottom 애니메이션 시간(transition-duration)
          break;
        default:
          ref.current?.style.setProperty("display", "flex");

          setTimeout(() => {
            if (!ref.current) return;

            ref.current?.style.setProperty(
              "transform",
              `translateY(-${pullUp}%)`
            );
            ref.current?.style.setProperty(
              "padding-bottom",
              `${100 - pullUp + DEFAULT_BUTTON_HEIGHT}vh`
            );
            setPrevDist(pullUp);

            _.debounce(
              () => ref.current!.style.setProperty("user-select", "auto"),
              750
            );
          }, 0);
          break;
      }
  }, [pullUp]);

  const { bottomSheet } = useContext(globalContext);
  const pathname = usePathname(),
    searchParams = useSearchParams();
  useEffect(() => {
    return () => {
      bottomSheet.set({
        children: null,
      });
    };
  }, [pathname, searchParams]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col absolute z-30"
      style={{
        width: `${width}px`,
        height: `${height}px`,

        top: `${height}px`,

        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "#242426",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",

        transition: "transform 0.75s ease-out",

        display: "none",
        // visibility: "hidden",

        paddingBottom: `${DEFAULT_BUTTON_HEIGHT}vh`,
      }}
    >
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
  // const { sheet, content } = useBottomSheet();

  return (
    <>
      {pullUp && pullUp !== "hidden" && (
        <div
          className="absolute w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)] z-20"
          onClick={() =>
            setPullUp({
              location: "hidden",
            })
          }
        ></div>
      )}
      <Wrapper width={width} height={height} pullUp={pullUp}>
        {header && <BottomSheetHeader />}
        <BottomSheetContent>{children}</BottomSheetContent>
      </Wrapper>
    </>
  );
};
export default BottomSheet;
