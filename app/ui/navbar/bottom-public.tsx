"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import HomeButton from "../buttons/home";
import FeedbackIcon from "../images/navbar/feedback";
import LoginIcon from "../images/navbar/login";
import FeedbackPopup from "../popup/feedback";
import { useCalendarStore } from "@/app/stores";

export default function BottomNavBarPublic() {
  const router = useRouter();
  const pathname = usePathname();
  const triggerResetToToday = useCalendarStore((s) => s.triggerResetToToday);
  const [isFeedbackOn, setIsFeedbackOn] = useState(false);

  return (
    <>
      <div
        className="w-full flex flex-row relative"
        style={{
          height: "6.93vh",
          background: "var(--background)",
        }}
      >
        <div
          className="grow flex justify-center items-center"
          style={{
            padding: "6px 18px",
            borderTop: `1px solid ${isFeedbackOn ? "#A3FF0C" : "#323234"}`,
            cursor: "pointer",
          }}
          onClick={() => setIsFeedbackOn(true)}
        >
          <FeedbackIcon focused={isFeedbackOn} />
        </div>
        <div
          style={{
            position: "absolute",
            left: "calc(50% - 28px)",
            bottom: "2.13vh",
            cursor: "pointer",
          }}
          onClick={() => {
            if (pathname === "/") {
              triggerResetToToday();
            } else {
              router.push("/");
            }
          }}
        >
          <HomeButton />
        </div>
        <div
          className="grow flex justify-center items-center"
          style={{
            padding: "6px 18px",
            borderTop: "1px solid #323234",
            cursor: "pointer",
          }}
          onClick={() => router.push("/signin")}
        >
          <LoginIcon />
        </div>
      </div>
      <FeedbackPopup
        isTurnedOn={isFeedbackOn}
        turnOff={() => setIsFeedbackOn(false)}
      />
    </>
  );
}
