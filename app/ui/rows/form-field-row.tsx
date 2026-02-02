"use client";

import { memo, ReactNode } from "react";
import { RightArrow } from "@/app/ui/images/arrows";

export interface FormFieldRowProps {
  left: string;
  right: string;
  err?: ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
}

export const FormFieldRow = memo(function FormFieldRow({
  left,
  right,
  err,
  onClick,
  showArrow = true,
}: FormFieldRowProps) {
  return (
    <div
      className="flex flex-row justify-between items-center px-5 py-2"
      style={{
        height: "6.9%",
        borderBottom: "1px solid #333335",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <p
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#DCDCDD",
        }}
      >
        {left}
      </p>
      <span className="flex flex-row items-center gap-2">
        {err}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#DCDCDD",
            opacity: 1,
          }}
        >
          {right}
        </p>
        {showArrow && <RightArrow className="ml-auto" />}
      </span>
    </div>
  );
});
