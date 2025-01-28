"use client";

import Bell from "@/app/ui/images/jamsession/bell";
import Calendar from "@/app/ui/images/jamsession/calendar";
import { DownArrow } from "../../images/arrows";
import LocationPopup from "@/app/(pages)/(only-user)/jamsession/popup/location";
import { useEffect, useState } from "react";
import { LocationEnum } from "@/app/lib/constants/location.enum";

export default function TopNavBar({
  location,
  setLocation,
}: {
  location: LocationEnum;
  setLocation: (location: LocationEnum) => void;
}) {
  const [isLocationClicked, setIsLocationClicked] = useState(false);
  const handleLocationClick = () => {
    setIsLocationClicked(!isLocationClicked);
  };

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
          }}>
          {LocationEnum[location] ?? "지역"}
        </p>
        <DownArrow />
      </div>
      <div className="flex flex-row gap-5">
        <Bell />
        <Calendar />
      </div>
      <LocationPopup
        turnOn={isLocationClicked}
        turnOff={handleLocationClick}
        setLocation={setLocation}
      />
    </div>
  );
}
