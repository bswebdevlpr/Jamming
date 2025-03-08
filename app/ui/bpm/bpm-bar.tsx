"use client";

import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import Love from "../images/love";
import { convertBPMToTempo } from "@/app/lib/functions/convert";
import { useState } from "react";
import BPMPopup from "./popup";

export default function BPMBar({
  user,
  className,
}: {
  user: Entity_User;
  className?: string;
}) {
  const [isBPMPopupOn, setIsBPMPopupOn] = useState(false);

  return (
    <div
      className={`w-full flex flex-col ${className}`}
      style={{
        marginBottom: "22px",
      }}
    >
      <div
        className="flex justify-between"
        style={{
          fontFamily: "SUIT-TITLE",
          lineHeight: "150%",

          marginBottom: "8px",
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            color: "var(--highlight)",
          }}
        >
          {user?.bpm ?? 0} BPM
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#E5E5E9",
            letterSpacing: "-0.35px",
          }}
        >
          {user?.bpm ? convertBPMToTempo(user.bpm) : "-"}
        </p>
      </div>
      <div className="w-full h-2 flex relative">
        <div
          className="h-full relative"
          style={{
            width: user && user.bpm ? `calc(${(user.bpm / 200) * 100}%)` : 0,
            backgroundColor: "var(--highlight)",
          }}
        />
        <div
          className="grow h-full"
          style={{
            backgroundColor: "#323234",
          }}
        >
          <Love
            style={{
              position: "absolute",
              transform: `translate(-10px, -10px) rotate(-20deg)`,
            }}
          />
        </div>
      </div>
      <div
        className="w-fit inline-flex items-center gap-1 px-2 py-1 mt-4"
        style={{
          fontFamily: "SUIT-BODY",
          color: "#C0C0C5",

          backgroundColor: "#242426",
          borderRadius: "100px",

          cursor: "pointer",
        }}
      >
        <p
          style={{
            width: "14px",
            height: "14px",

            fontSize: "0.625rem",

            border: "1.5px solid #9F9FA2",
            borderRadius: "50%",

            textAlign: "center",
            lineHeight: "14px",
          }}
        >
          ?
        </p>
        <p
          style={{
            fontSize: "0.875rem",
          }}
          onClick={() => setIsBPMPopupOn(true)}
        >
          What is BPM
        </p>
      </div>
      <BPMPopup
        isTurnedOn={isBPMPopupOn}
        turnOff={() => setIsBPMPopupOn(false)}
      />
    </div>
  );
}
