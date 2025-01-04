"use client";

import { globalContext } from "@/app/(pages)/layout";
import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export default function PopupTemplate({
  children,
  isTurnedOn,
  width,
  height,
  className,
  style,
}: {
  children: ReactNode;
  isTurnedOn: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { bodyWidth, bodyHeight } = useContext(globalContext);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);
  //

  return (
    <div
      ref={ref}
      className={`hidden absolute z-10 ${className}`}
      style={{
        width: `${width ?? bodyWidth}px`,
        height: `${height ?? bodyHeight}px`,

        top: 0,
        left: 0,

        overflow: "auto",

        backgroundColor: "var(--background)",

        ...style,
      }}
    >
      {children}
    </div>
  );
}
