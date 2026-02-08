"use client";

import Image from "next/image";
import { useNotificationStore } from "@/app/stores";

export default function Bell({ onClick }: { onClick?: () => void }) {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <div
      className="relative"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <Image
        src="/jamsession/bell.svg"
        alt="bell"
        width={20.01}
        height={20.57}
      />
      {unreadCount > 0 && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: "-4px",
            right: "-4px",
            minWidth: "16px",
            height: "16px",
            borderRadius: "9999px",
            backgroundColor: "#FF3E2F",
            padding: "0 4px",
          }}
        >
          <p
            style={{
              fontFamily: "Pretendard",
              fontWeight: 600,
              fontSize: "0.625rem",
              color: "#FFF",
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </p>
        </div>
      )}
    </div>
  );
}
