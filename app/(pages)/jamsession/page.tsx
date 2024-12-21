"use client";

import Filter from "@/app/ui/images/filter";
import { useContext } from "react";
import { globalContext } from "../layout";
import BottomSheetContent from "./bottom-sheet/content";

export default function JamSession() {
  const { bottomSheet } = useContext(globalContext);

  return (
    <div className="grow flex flex-col">
      {/* <CategoryFilter />  */}
      {/* 슬라이드 캘린더 */}
      <p className="py-8 text-center">Slide Calendarrrrrrrrrrrr</p>
      {/* 잼세션 피드 */}
      <div className="flex flex-row justify-between pb-4">
        <p
          style={{
            fontFamily: "SBAggroB",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}>
          JAM SESSION
        </p>
        <span className="flex flex-row gap-1 justify-center items-center">
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#9F9FA2",
            }}>
            필터
          </p>
          <div
            onClick={() =>
              bottomSheet.setter({
                location: "high",
                children: <BottomSheetContent />,
              })
            }>
            <Filter />
          </div>
        </span>
      </div>
      <div className="grow flex justify-center items-center">
        Jam Session Feeeddddddddd
      </div>
    </div>
  );
}
