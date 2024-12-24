"use client";

import { useEffect, useRef } from "react";

export default function Modal({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);

  return (
    <div
      className="absolute w-full h-full flex justify-center items-center px-8"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="grow flex flex-col px-5 py-4"
        style={{
          height: "30.56%",

          backgroundColor: "#242426",
          border: "1px solid #444447",
          borderRadius: "12px",
        }}
      >
        <p
          className="mb-3"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          참여 신청 어필 한마디!
        </p>
        <div
          className="grow p-3 mb-8"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#E5E5E9",

            border: "1px solid #767678",
            borderRadius: "8px",
          }}
        >
          입력
          <p>0/300</p>
        </div>
        <div className="flex flex-row gap-3">
          <button
            style={{
              width: "42.02%",
              height: "13.95%",
              borderRadius: "8px",

              fontFamily: "SUIT-BODY",
              fontSize: "1rem",

              border: "1px solid #444447",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
