"use client";

import Filter from "@/app/ui/images/filter";
import { Fragment, useContext, useEffect, useState } from "react";
import BottomSheetContent from "./bottom-sheet/content";
import TopNavBar from "@/app/ui/navbar/jamsession/top";
import BottomNavBar from "@/app/ui/navbar/bottom";
import JamNow from "@/app/ui/buttons/jam-now";
import { globalContext } from "../../layout";
import { LocationEnum } from "@/app/lib/constants/location.enum";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import moment from "moment";
import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import JamFeed from "@/app/ui/feeds/jam-feed";

export default function JamSession() {
  // GLOBAL
  const { bottomSheet } = useContext(globalContext);
  //

  // STATES
  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());

  const [filters, setFilters] = useState<any[]>([
    genre,
    position,
    level,
    location,
  ]);
  //

  useEffect(() => {
    setFilters([
      LocationEnum[location],
      GenreEnum[genre],
      PositionEnum[position],
      LevelEnum[level],
    ]);
  }, [location, genre, position, level]);

  useEffect(() => {
    console.log("at page, selectedDate", selectedDate);
  }, [selectedDate]);

  return (
    <div className="h-full flex flex-col">
      <TopNavBar
        location={location}
        selectedDate={selectedDate}
        setLocation={setLocation}
        setSelectedDate={setSelectedDate}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="p-5">
        <SlideCalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
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
        <div className="overflow-hidden flex justify-center items-center px-5">
          <JamFeed />
        </div>
        <Fragment>
          <JamNow
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <BottomNavBar />
        </Fragment>
      </div>
    </div>
  );
}
