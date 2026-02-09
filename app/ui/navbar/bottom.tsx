"use client";

import { useRouter, usePathname } from "next/navigation";
import HomeButton from "../buttons/home";
import MyActivity from "../images/navbar/my-activity";
import UserProfile from "../images/navbar/user-profile";
import { motion } from "framer-motion";
import { TAB_COLORS, TRANSITION } from "@/app/lib/animations";

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
      <motion.div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
          cursor: "pointer",
        }}
        onClick={() => router.push("/myact")}
        whileTap={{ scale: 0.95 }}
        transition={TRANSITION.fast}
        animate={{
          borderTop: `1px solid ${
            path.startsWith("/myact") ? TAB_COLORS.activeBorder : TAB_COLORS.inactiveBorder
          }`,
        }}
      >
        <MyActivity focused={path.startsWith("/myact")} />
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          left: "calc(50% - 28px)",
          bottom: "2.13vh",

          cursor: "pointer",
        }}
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={TRANSITION.fast}
      >
        <HomeButton />
      </motion.div>
      <motion.div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
          cursor: "pointer",
        }}
        onClick={() => router.push("/mypage")}
        whileTap={{ scale: 0.95 }}
        transition={TRANSITION.fast}
        animate={{
          borderTop: `1px solid ${
            path.startsWith("/mypage") ? TAB_COLORS.activeBorder : TAB_COLORS.inactiveBorder
          }`,
        }}
      >
        <span className="flex flex-col items-center">
          <UserProfile focused={path.startsWith("/mypage")} />
          <motion.p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "12px",
            }}
            animate={{
              color: path.startsWith("/mypage") ? TAB_COLORS.active : TAB_COLORS.inactive,
            }}
            transition={TRANSITION.normal}
          >
            프로필
          </motion.p>
        </span>
      </motion.div>
    </div>
  );
}
