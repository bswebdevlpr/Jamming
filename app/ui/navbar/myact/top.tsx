"use client";

import Bell from "@/app/ui/images/jamsession/bell";
import CalendarImage from "@/app/ui/images/jamsession/calendar";

export default function TopNavBar() {
  return (
    <div className="flex flex-row justify-between px-5 py-3">
      <p
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#FFF",
        }}
      >
        8월 14일 수요일
      </p>
      <div className="flex flex-row gap-5">
        <Bell />
        <CalendarImage />
      </div>
    </div>
  );
}
