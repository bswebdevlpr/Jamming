"use client";

import Filter from "@/app/ui/images/filter";
import { useContext, useEffect, useState } from "react";
import BottomSheetContent from "./bottom-sheet/content";
import TopNavBar from "@/app/ui/navbar/jamsession/top";
import BottomNavBar from "@/app/ui/navbar/bottom";
import JamNow from "@/app/ui/buttons/jam-now";
import { globalContext } from "../../layout";
import { LocationEnum } from "@/app/lib/constants/location.enum";
import CommuteRecordDateSlider from "@/app/ui/calendar/slide-calendar";
import moment from "moment";

export default function JamSession() {
  // GLOBAL
  const { bottomSheet } = useContext(globalContext);
  //

  // STATES
  const [location, setLocation] = useState<LocationEnum>();
  const [selectedDate, setSelectedDate] = useState<number>(moment().date());
  //

  useEffect(() => {
    console.log("location:", location);
    console.log("selectedDate:", selectedDate);
  }, [location, selectedDate]);

  return (
    <div className="grow flex flex-col">
      <TopNavBar location={location} setLocation={setLocation} />
      <div className="p-5">
        <CommuteRecordDateSlider
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="flex flex-row justify-between px-5 pb-4">
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
              bottomSheet.set({
                location: "high",
                children: <BottomSheetContent />,
              })
            }>
            <Filter />
          </div>
        </span>
      </div>
      {/* 잼세션 피드 */}
      <div className="grow flex justify-center items-center px-5">
        Jam Session Feeeddddddddd
      </div>
      <JamNow />
      <BottomNavBar />
    </div>
  );
}
