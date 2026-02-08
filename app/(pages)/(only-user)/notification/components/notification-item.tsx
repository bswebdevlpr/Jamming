"use client";

import { Entity_Notification } from "@/app/lib/interfaces/entity.interface";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function NotificationItem({
  notification,
}: {
  notification: Entity_Notification;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (notification.type === "rejam") {
      router.push("/myact");
    }
  };

  return (
    <div
      className="flex flex-row items-start gap-3 px-5 py-4"
      style={{
        borderBottom: "1px solid #323234",
        cursor: "pointer",
        backgroundColor: notification.is_read
          ? "transparent"
          : "rgba(163, 255, 12, 0.04)",
      }}
      onClick={handleClick}
    >
      {/* 미읽음 표시 */}
      <div
        className="mt-2 shrink-0"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: notification.is_read ? "transparent" : "#A3FF0C",
        }}
      />

      <div className="grow flex flex-col gap-1">
        {/* 타입 라벨 */}
        {notification.type === "rejam" && (
          <p
            style={{
              fontFamily: "SBAggroB",
              fontSize: "0.75rem",
              color: "#A3FF0C",
            }}
          >
            REJAM!
          </p>
        )}

        {/* 제목 */}
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "0.875rem",
            color: "#FFF",
            lineHeight: "140%",
          }}
        >
          {notification.title}
        </p>

        {/* 본문 */}
        {notification.body && (
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
              lineHeight: "140%",
            }}
          >
            {notification.body}
          </p>
        )}

        {/* 시간 */}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#535355",
          }}
        >
          {moment(notification.created_at).fromNow()}
        </p>
      </div>
    </div>
  );
}
