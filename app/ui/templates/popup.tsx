"use client";

import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export default function PopupTemplate({
  children,
  className,
  style,
  isTurnedOn,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  isTurnedOn: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // STATES
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  //

  useEffect(() => {
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);
  }, []);

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
        width: `${width}px`,
        height: `${height}px`,

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
