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
    console.log("isTurnedOn:", isTurnedOn);
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);

  return (
    <div
      ref={ref}
      className="absolute w-full h-full flex justify-center items-center px-8 hidden"
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
          className="p-3 mb-8"
          style={{
            height: "54.05%",

            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#E5E5E9",

            border: "1px solid #767678",
            borderRadius: "8px",

            position: "relative",
          }}
        >
          입력
          <p
            style={{
              position: "absolute",
              bottom: 8,
              right: 10,

              fontSize: "0.75rem",
              color: "#9F9FA2",
            }}
          >
            0/300
          </p>
        </div>
        <div
          className="grow flex flex-row gap-3"
          style={{
            height: "16.21%",
          }}
        >
          <button
            style={{
              width: "47.90%",

              fontFamily: "SUIT-BODY",
              fontSize: "1rem",

              borderRadius: "8px",
              border: "1px solid #444447",
              backgroundColor: "#323234",
            }}
            onClick={turnOff}
          >
            취소
          </button>
          <button
            style={{
              width: "47.90%",

              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#A3FF0C",

              borderRadius: "8px",
              border: "1px solid #A3FF0C",
              backgroundColor: "#304313",
            }}
            onClick={turnOff}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
