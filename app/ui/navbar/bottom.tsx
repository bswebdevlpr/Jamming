"use client";

import { redirect, usePathname } from "next/navigation";
import HomeButton from "../buttons/home";
import MyActivity from "../images/navbar/my-activity";
import Profile from "../images/navbar/profile";

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

          cursor: "pointer",
        }}
        onClick={() => redirect("/myact")}
      >
        <MyActivity focused={path.startsWith("/myact")} />
      </div>
      <div
        style={{
          transform: "translate(0vh, -2.13vh)", // 16px

          cursor: "pointer",
        }}
        onClick={() => redirect("/jamsession")}
      >
        <HomeButton />
      </div>
      <div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
          borderTop: `1px solid ${
            path.startsWith("/mypage") ? "#A3FF0C" : "#323234"
          }`,

          cursor: "pointer",
        }}
        onClick={() => redirect("/mypage")}
      >
        <span className="flex flex-col items-center">
          <Profile focused={path.startsWith("/mypage")} />
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "12px",
              color: path.startsWith("/mypage") ? "#A3FF0C" : "#9F9FA2",
            }}
          >
            프로필
          </p>
        </span>
      </div>
    </div>
  );
}
