"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markAllAsRead,
} from "@/app/api/functions/notification";
import { useNotificationStore } from "@/app/stores";
import { Entity_Notification } from "@/app/lib/interfaces/entity.interface";
import NotificationItem from "./components/notification-item";

export default function NotificationPage() {
  const router = useRouter();
  const resetUnread = useNotificationStore((state) => state.resetUnread);

  const [notifications, setNotifications] = useState<Entity_Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getNotifications();
        if (result.success) {
          setNotifications(result.data);
        }

        const markResult = await markAllAsRead();
        if (markResult.success) {
          resetUnread();
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [resetUnread]);

  return (
    <div className="grow flex flex-col">
      {/* 헤더 */}
      <div
        className="px-5"
        style={{ borderBottom: "1px solid #323234" }}
      >
        <ImageWithTxt
          image={<LeftArrowWhite onClick={() => router.back()} />}
          text="알림"
          className="gap-2 py-3"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        />
      </div>

      {/* 알림 목록 */}
      <div className="grow overflow-without-scroll">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              로딩 중...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              알림이 없습니다
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
