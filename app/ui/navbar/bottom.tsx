"use client";

import { useRouter, usePathname } from "next/navigation";
import HomeButton from "../buttons/home";
import MyActivity from "../images/navbar/my-activity";
import UserProfile from "../images/navbar/user-profile";
import BandIcon from "../images/navbar/band-icon";
import RecruitIcon from "../images/navbar/recruit-icon";
import { motion } from "framer-motion";
import { TAB_COLORS, TRANSITION } from "@/app/lib/animations";
import { useCalendarStore } from "@/app/stores";

interface NavTabProps {
  label: string;
  path: string;
  currentPath: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function NavTab({ label, path, currentPath, icon, onClick }: NavTabProps) {
  const isActive = currentPath.startsWith(path);
  return (
    <motion.div
      className="flex-1 flex justify-center items-center"
      style={{
        padding: "6px 0",
        cursor: "pointer",
      }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={TRANSITION.fast}
      animate={{
        borderTop: `1px solid ${
          isActive ? TAB_COLORS.activeBorder : TAB_COLORS.inactiveBorder
        }`,
      }}
      role="tab"
      aria-selected={isActive}
      aria-label={label}
    >
      <span className="flex flex-col items-center">
        {icon}
        <motion.p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "12px",
          }}
          animate={{
            color: isActive ? TAB_COLORS.active : TAB_COLORS.inactive,
          }}
          transition={TRANSITION.normal}
        >
          {label}
        </motion.p>
      </span>
    </motion.div>
  );
}

export default function BottomNavBar() {
  const router = useRouter();
  const path = usePathname();
  const triggerResetToToday = useCalendarStore((s) => s.triggerResetToToday);

  return (
    <div
      className="w-full flex flex-row relative"
      style={{
        height: "6.93vh", // 52px
        background: "var(--background)",
      }}
      role="tablist"
      aria-label="메인 네비게이션"
    >
      {/* 왼쪽 2탭 */}
      <NavTab
        label="내 활동"
        path="/myact"
        currentPath={path}
        icon={<MyActivity focused={path.startsWith("/myact")} />}
        onClick={() => router.push("/myact")}
      />
      <NavTab
        label="밴드"
        path="/band"
        currentPath={path}
        icon={<BandIcon focused={path.startsWith("/band")} />}
        onClick={() => router.push("/band")}
      />

      {/* 가운데 Home 버튼 (절대 위치) */}
      <motion.div
        style={{
          position: "absolute",
          left: "calc(50% - 28px)",
          bottom: "2.13vh",
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={() => {
          if (path === "/") {
            triggerResetToToday();
          } else {
            router.push("/");
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={TRANSITION.fast}
        role="tab"
        aria-label="홈"
      >
        <HomeButton />
      </motion.div>

      {/* 오른쪽 2탭 */}
      <NavTab
        label="구인"
        path="/recruit"
        currentPath={path}
        icon={<RecruitIcon focused={path.startsWith("/recruit")} />}
        onClick={() => router.push("/recruit")}
      />
      <NavTab
        label="프로필"
        path="/mypage"
        currentPath={path}
        icon={<UserProfile focused={path.startsWith("/mypage")} />}
        onClick={() => router.push("/mypage")}
      />
    </div>
  );
}
