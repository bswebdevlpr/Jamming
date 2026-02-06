"use client";

import Bell from "@/app/ui/images/jamsession/bell";
// import CalendarImage from "@/app/ui/images/jamsession/calendar";
import { DownArrow } from "../../images/arrows";
import LocationPopup from "@/app/(pages)/(only-user)/jamsession/popup/location";
import {
  Dispatch,
  SetStateAction,
  // useContext,
  // useEffect,
  useState,
} from "react";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { Filter_JamSessionFeed } from "../../feeds/jam-feed";

export default function TopNavBar({
  filter,
  // setFilter,
  setLocation,
}: // setSelectedDate,
{
  filter: Filter_JamSessionFeed;
  // setFilter: Dispatch<SetStateAction<Filter_JamSessionFeed>>;
  setLocation: (location: LocationEnum) => void;
  // setSelectedDate: (input: moment.Moment) => void;
}) {

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
          }}>
          {LocationEnum[filter.location] ?? "지역"}
        </p>
        <DownArrow />
      </div>
      <div className="flex flex-row gap-5">
        <Bell />
        {/* <CalendarImage
          onClick={() =>
            bottomSheet.set({
              header: false,
              location: "high",
              children: (
                <CalendarComponent
                  setSelectedDate={setSelectedDate}
                  filter={filter}
                  setFilter={setFilter}
                />
              ),
            })
          }
        /> */}
      </div>
      <LocationPopup
        turnOn={isLocationClicked}
        turnOff={handleLocationClick}
        setLocation={setLocation}
      />
    </div>
  );
}
