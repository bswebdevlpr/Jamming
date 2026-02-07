"use client";

import { useRouter, usePathname } from "next/navigation";
import HomeButton from "../buttons/home";
import MyActivity from "../images/navbar/my-activity";
import UserProfile from "../images/navbar/user-profile";

export default function BottomNavBar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <div
      className="w-full flex flex-row relative"
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
        onClick={() => router.push("/myact")}
      >
        <MyActivity focused={path.startsWith("/myact")} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "calc(50% - 28px)",
          bottom: "2.13vh",

          cursor: "pointer",
        }}
        onClick={() => router.push("/jamsession")}
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
        onClick={() => router.push("/mypage")}
      >
        <span className="flex flex-col items-center">
          <UserProfile focused={path.startsWith("/mypage")} />
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
