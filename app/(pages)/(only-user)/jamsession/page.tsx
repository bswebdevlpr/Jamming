"use client";

import Filter from "@/app/ui/images/filter";
import { useContext } from "react";
import BottomSheetContent from "./bottom-sheet/content";
import TopNavBar from "@/app/ui/navbar/jamsession/top";
import BottomNavBar from "@/app/ui/navbar/bottom";
import JamNow from "@/app/ui/buttons/jam-now";
import { globalContext } from "../../layout";

export default function JamSession() {
  const { bottomSheet } = useContext(globalContext);

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
          JAM SESSION
        </p>
        <span className="flex flex-row gap-1 justify-center items-center">
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#9F9FA2",
            }}
          >
            필터
          </p>
          <div
            onClick={() =>
              bottomSheet.set({
                location: "high",
                children: <BottomSheetContent />,
              })
            }
          >
            <Filter />
          </div>
        </span>
      </div>
      <div className="grow flex justify-center items-center px-5">
        Jam Session Feeeddddddddd
      </div>
      <JamNow />
      <BottomNavBar />
    </div>
  );
}
