"use client";

import Bell from "@/app/ui/images/jamsession/bell";
// import CalendarImage from "@/app/ui/images/jamsession/calendar";
import { DownArrow } from "../../images/arrows";
import LocationPopup from "@/app/ui/popup/location";
import { useState } from "react";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { Filter_JamSessionFeed } from "../../feeds/jam-feed";
import { useRouter } from "next/navigation";
import { getLocationDisplay } from "@/app/lib/utils/location";

export default function TopNavBar({
  filter,
  setLocation,
  isAuthenticated,
  isAuthLoading,
}: {
  filter: Filter_JamSessionFeed;
  setLocation: (location: LocationEnum) => void;
  isAuthenticated?: boolean | null;
  isAuthLoading?: boolean;
}) {
  const router = useRouter();

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
      {/* 왼쪽: 지역 선택 */}
      <div className="flex flex-row gap-1" onClick={handleLocationClick}>
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}>
          {getLocationDisplay(filter.location)}
        </p>
        <DownArrow />
      </div>

      {/* 오른쪽: 소개 (비인증) 또는 Bell (인증) */}
      <div className="flex flex-row gap-5 items-center" style={{ minWidth: "28px" }}>
        {isAuthLoading ? (
          <div style={{ width: "28px", height: "20px" }} />
        ) : isAuthenticated ? (
          <Bell onClick={() => router.push("/notification")} />
        ) : (
          <button
            onClick={() => router.push("/about")}
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#A3FF0C",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0",
            }}
          >
            소개
          </button>
        )}
      </div>

      <LocationPopup
        isTurnedOn={isLocationClicked}
        turnOff={handleLocationClick}
        setLocation={setLocation}
      />
    </div>
  );
}
