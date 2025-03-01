"use client";

import Bell from "@/app/ui/images/jamsession/bell";
import CalendarImage from "@/app/ui/images/jamsession/calendar";
import { DownArrow } from "../../images/arrows";
import LocationPopup from "@/app/(pages)/(only-user)/jamsession/popup/location";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { globalContext } from "@/app/(pages)/layout";
import CalendarComponent from "../../calendar/calendar";
import { Filter_JamSessionFeed } from "@/app/(pages)/(only-user)/jamsession/page";

export default function TopNavBar({
  location,
  selectedDate,
  setLocation,
  setSelectedDate,
  filter,
  setFilter,
}: {
  location: LocationEnum;
  selectedDate: moment.Moment;
  setLocation: (location: LocationEnum) => void;
  setSelectedDate: (input: moment.Moment) => void;
  filter: Filter_JamSessionFeed;
  setFilter: Dispatch<SetStateAction<Filter_JamSessionFeed>>;
}) {
  // GLOBAL
  const { bottomSheet } = useContext(globalContext);
  //

  // STATES
  const [isLocationClicked, setIsLocationClicked] = useState(false);
  //

  // HANDLERS
  const handleLocationClick = () => {
    setIsLocationClicked(!isLocationClicked);
  };
  //

  return (
    <div className="flex flex-row justify-between px-5 py-3">
      <div className="flex flex-row gap-1" onClick={handleLocationClick}>
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          {LocationEnum[location] ?? "지역"}
        </p>
        <DownArrow />
      </div>
      <div className="flex flex-row gap-5">
        <Bell />
        <CalendarImage
          onClick={() =>
            bottomSheet.set({
              header: false,
              location: "high",
              children: (
                <CalendarComponent
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  filter={filter}
                  setFilter={setFilter}
                />
              ),
            })
          }
        />
      </div>
      <LocationPopup
        turnOn={isLocationClicked}
        turnOff={handleLocationClick}
        setLocation={setLocation}
      />
    </div>
  );
}
