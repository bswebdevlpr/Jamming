"use client";

import Bell from "@/app/ui/images/jamsession/bell";
import Calendar from "@/app/ui/images/jamsession/calendar";
import { DownArrow } from "../../images/arrows";
import LocationPopup from "@/app/(pages)/jamsession/popup/location";
import { useState } from "react";

export default function TopNavBar() {
  const [isLocationClicked, setIsLocationClicked] = useState(false);
  const handleLocationClick = () => {
    setIsLocationClicked(!isLocationClicked);
  };

  return (
    <div className="flex flex-row justify-between py-3">
      <div className="flex flex-row gap-1" onClick={handleLocationClick}>
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          서울
        </p>
        <DownArrow />
      </div>
      <div className="flex flex-row gap-5">
        <Bell />
        <Calendar />
      </div>
      <LocationPopup
        turnOn={isLocationClicked}
        invertLocation={setIsLocationClicked}
      />
    </div>
  );
}
