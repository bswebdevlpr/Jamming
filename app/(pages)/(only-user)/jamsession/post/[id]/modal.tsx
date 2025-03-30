"use client";

import { createJamEntry } from "@/app/api/functions/create";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { MapPositionToData } from "@/app/lib/maps/jam";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Modal({
  isTurnedOn,
  turnOff,
  user_id,
  jam_id,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  user_id: string;
  jam_id: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // STATES
  const [pos, setPos] = useState<PositionEnum>(null);
  const [appeal, setAppeal] = useState<string>("");
  //

  useEffect(() => {
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
          height: "40.56%",

          backgroundColor: "#242426",
          border: "1px solid #444447",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "#FFF",
            marginBottom: "12px",
          }}
        >
          포지션 선택
        </p>
        <div className="flex gap-1.75 mb-6.25">
          {Object.values(PositionEnum).map((val, idx) => (
            <p
              key={idx}
              className="px-2 py-1.25"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                lineHeight: "140%",
                textAlign: "center",

                borderRadius: "50px",

                whiteSpace: "nowrap",

                ...(val === pos
                  ? {
                      color: "#FF3773",
                      border: "1px solid #FF3773",
                      background: "rgba(255, 55, 115, 0.12)",
                    }
                  : {
                      color: "#FFF",
                      background: "#535355",
                      border: "1px solid #535355",
                    }),
              }}
              onClick={() => setPos(val)}
            >
              {val}
            </p>
          ))}
        </div>
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
          style={{
            width: "100%",
            height: "46.51%",
            position: "relative",
            marginBottom: "32px",
          }}
        >
          <style jsx>{`
              textarea::placeholder {
                color: #E5E5E9;
                font-family: "SUIT-BODY",
                font-size: "0.875rem",
                opacity: 0.5;
              }
            `}</style>
          <textarea
            placeholder="입력"
            maxLength={50}
            className="p-3"
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #767678",
              borderRadius: "8px",

              fontSize: "0.875rem",
            }}
            onChange={(e) => setAppeal(e.target.value)}
          />
          <p
            style={{
              position: "absolute",
              bottom: 8,
              right: 10,

              fontSize: "0.75rem",
              color: "#9F9FA2",
            }}
          >
            {`${appeal.length}/50`}
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
            onClick={() => {
              createJamEntry({
                user_id,
                jam_id,
                appeal,
                applied_pos: MapPositionToData[pos],
              }).then(() => {
                router.push("/jamsession");
              });
            }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
