"use client";

import TopNavBar from "@/app/ui/navbar/myact/top";
import { useEffect, useState } from "react";
import Popup from "./[id]/popup";
import moment from "moment";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import { Filter_JamSessionFeed, JamFeed } from "@/app/ui/feeds/jam-feed";

export default function JamSession() {
  // STATES
  const [isPopupOn, setIsPopupOn] = useState(false);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());

  const [filter, setFilter] = useState<Filter_JamSessionFeed>({
    selectedDate,
    atMyAct: true,
    location: null,
    genre: null,
    position: null,
    level: null,
  });
  //

  // HOOKS
  useEffect(() => {
    setFilter({
      ...filter,
      selectedDate,
    });
  }, [selectedDate]);
  //

  return (
    <div className="grow flex flex-col">
      <TopNavBar
        filter={filter}
        setFilter={setFilter}
        setSelectedDate={setSelectedDate}
      />
      {/* 슬라이드 */}
      <div className="p-5">
        <SlideCalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
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
      <div className="grow overflow-hidden flex justify-center items-center px-5">
        <JamFeed filter={filter} />
      </div>
      <Popup isTurnedOn={isPopupOn} turnOff={() => setIsPopupOn(false)} />
    </div>
  );
}
