"use client";

import { globalContext } from "@/app/(pages)/layout";
import { CSSProperties, useContext } from "react";

const commonStyle = {
  width: "67.76%",
  height: "2.75rem",

  border: "1px solid #535355",
  borderRadius: "0.5rem",

  backgroundColor: "#323234",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",
};

export default function SelectButton({
  style,
  isActive,
}: {
  style?: CSSProperties;
  isActive?: boolean;
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

  // CONTEXT
  const { bottomSheet } = useContext(globalContext);
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
