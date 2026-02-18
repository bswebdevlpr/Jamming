"use client";

import { motion } from "framer-motion";
import { FADE_VARIANTS } from "@/app/lib/animations";

// 선택 날짜 기준 좌우 바 높이 (px) - 과거는 활성처럼, 미래는 비어있게
const BARS = [
  { height: 28, past: true },
  { height: 40, past: true },
  { height: 34, past: true },
  { height: 4,  past: false, today: true },
  { height: 4,  past: false },
  { height: 4,  past: false },
  { height: 4,  past: false },
] as const;

export default function MyActEmpty() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-7 px-8"
      variants={FADE_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {/* EQ 비주얼 */}
      <div
        className="flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        {/* 바 묶음 */}
        <div className="flex items-end justify-center gap-1.5" style={{ height: 52 }}>
          {BARS.map((bar, i) => (
            <div key={i} className="relative flex flex-col items-center justify-end" style={{ height: 52 }}>
              {/* TODAY 레이블 */}
              {("today" in bar && bar.today) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.45 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    fontFamily: "SBAggroB",
                    fontSize: "0.4375rem",
                    color: "var(--mid-gray-border)",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  TODAY
                </motion.span>
              )}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.08 + i * 0.05,
                }}
                style={{
                  width: ("today" in bar && bar.today) ? 14 : 12,
                  height: bar.height,
                  borderRadius: "3px 3px 0 0",
                  background: bar.past ? "var(--active-btn-bg)" : ("today" in bar && bar.today) ? "var(--mid-gray-border)" : "var(--border)",
                  transformOrigin: "bottom",
                }}
              />
            </div>
          ))}
        </div>

        {/* 베이스라인 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{
            width: 160,
            height: 1,
            background: "#2c2c2e",
            borderRadius: 1,
            transformOrigin: "center",
          }}
        />
      </div>

      {/* 텍스트 */}
      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "1.0625rem",
            color: "var(--foreground)",
            lineHeight: "140%",
          }}
        >
          이 날은 신호가 없었어요
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.8125rem",
            color: "#9F9FA2",
            lineHeight: "155%",
            letterSpacing: "-0.022em",
          }}
        >
          참여한 잼이 없는 날이에요
          <br />
          다른 날을 눌러 기록을 확인해보세요
        </p>
      </motion.div>
    </motion.div>
  );
}
