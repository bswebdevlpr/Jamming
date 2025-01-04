"use client";

import CreateJam from "@/app/(pages)/(only-user)/jamsession/popup/create-jam";
import Plus from "../images/jamsession/plus";
import { useState } from "react";

export default function JamNow() {
  const [isTurnedOn, setIsTurnedOn] = useState(false);
  const turnOff = () => {
    setIsTurnedOn(!isTurnedOn);
  };

  return (
    <div>
      <span
        className="flex flex-row jusify-center items-center w-fit h-11 gap-1 pl-2.5 pr-4"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #A3FF0C",
          borderRadius: "6.25rem",

          position: "absolute",
          bottom: "9.6%",
          right: "5.33%",

          cursor: "pointer",
        }}
        onClick={() => setIsTurnedOn(true)}
      >
        <Plus />
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "0.875rem",
            color: "#A3FF0C",
          }}
        >
          JAM NOW!
        </p>
      </span>
      <CreateJam isTurnedOn={isTurnedOn} turnOff={turnOff} />
    </div>
  );
}
