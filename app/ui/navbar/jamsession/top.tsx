"use client";

import Bell from "@/app/ui/images/jamsession/bell";
import CalendarImage from "@/app/ui/images/jamsession/calendar";
import { DownArrow } from "../../images/arrows";
import LocationPopup from "@/app/(pages)/(only-user)/jamsession/popup/location";
import { useContext, useEffect, useState } from "react";
import { LocationEnum } from "@/app/lib/constants/location.enum";
import { globalContext } from "@/app/(pages)/layout";
import CalendarComponent from "../../calendar/calendar";

export default function TopNavBar({
  location,
  selectedDate,
  setLocation,
  setSelectedDate,
}: {
  location: LocationEnum;
  selectedDate: moment.Moment;
  setLocation: (location: LocationEnum) => void;
  setSelectedDate: (input: moment.Moment) => void;
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

  useEffect(() => {
    console.log("inside top NavBar, location:", location);
  }, [location]);

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
                  filters={[
                    { text: "서울", value: "서울" },
                    { text: "재즈", value: "재즈" },
                    { text: "아마추어", value: "재즈" },
                    { text: "재즈", value: "재즈" },
                    { text: "재즈", value: "재즈" },
                    { text: "재즈", value: "재즈" },
                    { text: "재즈", value: "재즈" },
                    { text: "재즈", value: "재즈" },
                    { text: "재즈", value: "재즈" },
                    { text: "아마추어", value: "재즈" },
                  ]}
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
