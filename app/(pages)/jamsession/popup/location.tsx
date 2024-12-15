"use client";

import X from "@/app/ui/images/common/x";
import { useEffect, useRef, useState } from "react";

export default function LocationPopup({
  turnOn,
  invertLocation,
}: {
  turnOn: boolean;
  invertLocation: any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = turnOn ? "flex" : "none";
    }
  }, [turnOn]);

  return (
    <div
      ref={ref}
      className="hidden absolute z-10 flex flex-col"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#111113",
        top: 0,
        left: 0,
      }}
    >
      <div
        className="flex flex-row justify-between w-full px-5 py-3"
        style={{
          borderBottom: "1px solid #323234",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          지역 선택
        </p>
        <X onClick={invertLocation} />
      </div>
    </div>
  );
}
