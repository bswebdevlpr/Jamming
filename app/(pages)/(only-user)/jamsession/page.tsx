"use client";

import Filter from "@/app/ui/images/filter";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import BottomSheetContent from "./bottom-sheet/content";
import TopNavBar from "@/app/ui/navbar/jamsession/top";
import BottomNavBar from "@/app/ui/navbar/bottom";
import JamNow from "@/app/ui/buttons/jam-now";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import moment from "moment";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { Filter_JamSessionFeed, JamFeed } from "@/app/ui/feeds/jam-feed";
import { FeedMethods } from "@/app/ui/templates/feed";
import { globalContext } from "../../context";
import { useSearchParams } from "next/navigation";

export default function JamSession() {
  // GLOBAL
  const { bottomSheet } = useContext(globalContext);
  //

  // REF
  const childRef = useRef<FeedMethods>(null);
  //

  // STATES
  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [resetSlideCalendarDots, setResetSlideCalendarDots] =
    useState<boolean>(true);

  const [filter, setFilter] = useState<Filter_JamSessionFeed>({
    location,
    selectedDate,
    genre,
    position,
    level,
    setResetSlideCalendarDots,
  });
  //

  useEffect(() => {
    setFilter({
      location: LocationEnum[location],
      selectedDate,
      genre: GenreEnum[genre],
      position: PositionEnum[position],
      level: LevelEnum[level],
    });
  }, [location, selectedDate, genre, position, level]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const paramDate = searchParams.get("date");
    const paramDateFormatted =
      paramDate && moment(paramDate).format("YYYYMMDD");

    if (
      paramDateFormatted &&
      paramDateFormatted !== selectedDate.format("YYYYMMDD")
    )
      setSelectedDate(moment(paramDate));
  }, [searchParams]);

  return (
    <div className="h-full flex flex-col overflow-without-scroll">
      <TopNavBar
        filter={filter}
        // setFilter={setFilter}
        setLocation={setLocation}
        // setSelectedDate={setSelectedDate}
      />
      {/* 슬라이드 캘린더 */}
      <div className="p-5">
        <SlideCalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          resetSlideCalendarDots={resetSlideCalendarDots}
          setResetSlideCalendarDots={setResetSlideCalendarDots}
        />
      </div>
      <div className="grow overflow-hidden flex flex-col justify-between">
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
                  children: (
                    <BottomSheetContent
                      genre={genre}
                      position={position}
                      level={level}
                      setGenre={setGenre}
                      setPosition={setPosition}
                      setLevel={setLevel}
                    />
                  ),
                })
              }
            >
              <Filter />
            </div>
          </span>
        </div>
        {/* 잼세션 피드 */}
        <div className="grow overflow-hidden flex justify-center items-center px-5">
          <JamFeed ref={childRef} filter={filter} />
        </div>
        <Fragment>
          <JamNow
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            refetch={childRef && childRef.current && childRef.current.refetch}
            setResetSlideCalendarDots={setResetSlideCalendarDots}
          />
          <BottomNavBar />
        </Fragment>
      </div>
    </div>
  );
}
