"use client";

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
} from "react";

export default function PopupTemplate({
  children,
  isTurnedOn,
  className,
  style,
}: {
  children: ReactNode;
  isTurnedOn: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);
  //

  return (
    <div
      ref={ref}
      className={`hidden fixed z-10 ${className}`}
      style={{
        width: '100vw',
        height: 'calc(var(--vh, 1vh) * 100)',

        top: 0,
        left: 0,

        overflow: "auto",

        backgroundColor: "var(--background)",

        ...style,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
