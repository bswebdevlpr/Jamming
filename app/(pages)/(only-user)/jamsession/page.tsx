"use client";

import Filter from "@/app/ui/images/filter";
import { Fragment, useContext, useEffect, useState } from "react";
import BottomSheetContent from "./bottom-sheet/content";
import TopNavBar from "@/app/ui/navbar/jamsession/top";
import BottomNavBar from "@/app/ui/navbar/bottom";
import JamNow from "@/app/ui/buttons/jam-now";
import { globalContext } from "../../layout";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import moment from "moment";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import JamFeed from "@/app/ui/feeds/jam-feed";

export interface Filter_JamSessionFeed {
  location: LocationEnum;
  selectedDate: moment.Moment;
  genre: GenreEnum;
  position: PositionEnum;
  level: LevelEnum;
}

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

  const [filter, setFilter] = useState<Filter_JamSessionFeed>({
    location,
    selectedDate,
    genre,
    position,
    level,
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

  return (
    <div className="h-full flex flex-col">
      <TopNavBar
        location={location}
        selectedDate={selectedDate}
        setLocation={setLocation}
        setSelectedDate={setSelectedDate}
        filter={filter}
        setFilter={setFilter}
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
        <div className="grow overflow-hidden flex justify-center items-center px-5">
          <JamFeed filter={filter} />
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
