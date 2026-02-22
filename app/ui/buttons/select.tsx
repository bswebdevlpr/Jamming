"use client";

import { useBottomSheetStore } from "@/app/stores";
import { CSSProperties } from "react";

const commonStyle = {
  width: "var(--select-btn-width)",
  height: "2.75rem",

  border: "1px solid #535355",
  borderRadius: "0.5rem",

  backgroundColor: "#323234",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",

  cursor: "pointer",
};

export default function SelectButton({
  style,
  isActive,
  state,
}: {
  style?: CSSProperties;
  isActive?: boolean;
  state?: any;
}) {
  // STYLE
  const initStyle = {
    ...commonStyle,
    ...style,
  };
  const styleActivated = {
    ...initStyle,

    color: "#A3FF0C",
    border: "1px solid #A3FF0C",
    background: "rgba(163, 255, 12, 0.12)",
  };
  //

  // ZUSTAND STORE
  const bottomSheet = useBottomSheetStore();
  //

  return (
    <div
      className="flex justify-center items-center text-base"
      style={!isActive ? initStyle : styleActivated}
      onClick={() =>
        bottomSheet.set({
          location: "hidden",
        })
      }
    >
      선택
    </div>
  );
}
