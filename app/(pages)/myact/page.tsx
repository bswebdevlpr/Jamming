"use client";

import JamNow from "@/app/ui/buttons/jam-now";
import TopNavBar from "@/app/ui/navbar/myact/top";
import { useState } from "react";
import Popup from "./jamsession/popup";

export default function JamSession() {
  const [isPopupOn, setIsPopupOn] = useState(false);

  return (
    <div className="grow flex flex-col">
      <TopNavBar />
      {/* 슬라이드 캘린더 */}
      <p className="py-8 text-center">Slide Calendarrrrrrrrrrrr</p>
      {/* 잼세션 피드 */}
      <div className="flex flex-row justify-between px-5 pb-4">
        <p
          style={{
            fontFamily: "SBAggroB",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}
        >
          My Jam
        </p>
      </div>
      <div
        className="grow flex justify-center items-center px-5"
        onClick={() => setIsPopupOn(!isPopupOn)}
      >
        Jam Session Feeeddddddddd
      </div>
      <Popup isTurnedOn={isPopupOn} turnOff={() => setIsPopupOn(false)} />
      <JamNow />
    </div>
  );
}
