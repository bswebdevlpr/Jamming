"use client";

import { usePathname } from "next/navigation";
import HomeButton from "../buttons/home";
import MyActivity from "../images/navbar/my-activity";
import Profile from "../images/jamsession/profile";

export default function BottomNavBar() {
  const path = usePathname();

  return (
    <div
      className="w-full flex flex-row"
      style={{
        height: "6.93vh", // 52px
        background: "var(--background)",
      }}
    >
      <div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
          borderTop: `1px solid ${
            path.startsWith("/myact") ? "#A3FF0C" : "#323234"
          }`,
        }}
      >
        <MyActivity focused={path.startsWith("/myact")} />
      </div>
      <div
        style={{
          transform: "translate(0vh, -2.13vh)", // 16px
        }}
      >
        <HomeButton />
      </div>
      <div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
          borderTop: "1px solid #323234",
        }}
      >
        <Profile />
      </div>
    </div>
  );
}
