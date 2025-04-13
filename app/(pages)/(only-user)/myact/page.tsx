"use client";

import TopNavBar from "@/app/ui/navbar/myact/top";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import { Filter_JamSessionFeed, JamFeed } from "@/app/ui/feeds/jam-feed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FeedMethods } from "@/app/ui/templates/feed";

export default function MyAct() {
  const searchParams = useSearchParams();
  const dateParam = moment(searchParams.get("date"));

  const pathname = usePathname();
  const router = useRouter();

  // REF
  const childRef = useRef<FeedMethods>(null);
  //

  // MEMO & STATES
  const [isPopupOn, setIsPopupOn] = useState(false);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(
    dateParam.isValid() ? dateParam : moment()
  );

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
    const params = new URLSearchParams();
    params.set("date", selectedDate.format("YYYYMMDD"));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    setFilter({
      ...filter,
      selectedDate,
    });
  }, [selectedDate]);
  //

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      <TopNavBar
        filter={filter}
        // setFilter={setFilter}
        // setSelectedDate={setSelectedDate}
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
        <JamFeed filter={filter} ref={childRef} />
      </div>
    </div>
  );
}
