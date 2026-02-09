"use client";

import { ReactNode } from "react";
import ButtonTemplate from "../../buttons";

export default function BottomSheetContentTemplate_List({
  children,
  btnTxt,
  onClose,
}: {
  children: ReactNode;
  btnTxt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="h-full flex flex-col px-4 pt-2 pb-3"
      style={{
        fontFamily: "SUIT-BODY",
        fontSize: "0.875rem",
        lineHeight: "140%",
        letterSpacing: "-0.336px",
      }}
    >
      {children}
      <ButtonTemplate
        text={btnTxt}
        className="w-full"
        style={{
          borderRadius: "8px",
          border: "1px solid var(--dark-gray)",
          backgroundColor: "var(--inactive-bg)",
        }}
        onClick={onClose}
      />
    </div>
  );
}
