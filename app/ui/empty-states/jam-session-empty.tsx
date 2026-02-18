"use client";

import { motion } from "framer-motion";
import { FADE_VARIANTS } from "@/app/lib/animations";

const NOTES = [
  { char: "♩", size: "1.25rem", opacity: 0.35 },
  { char: "♪", size: "3rem",    opacity: 1,    highlight: true },
  { char: "♫", size: "1.75rem", opacity: 0.22 },
  { char: "♬", size: "1.125rem",opacity: 0.14 },
] as const;

export default function JamSessionEmpty() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8"
      variants={FADE_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {/* 음표 비주얼 */}
      <div
        className="flex items-end gap-2.5 select-none"
        aria-hidden="true"
      >
        {NOTES.map((note, i) => (
          <motion.span
            key={note.char}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: note.opacity, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 }}
            style={{
              fontFamily: "SBAggroL",
              fontSize: note.size,
              color: note.highlight ? "var(--highlight)" : "var(--mid-gray-border)",
              lineHeight: 1,
            }}
          >
            {note.char}
          </motion.span>
        ))}
      </div>

      {/* 텍스트 */}
      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.38 }}
      >
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "1.125rem",
            color: "var(--foreground)",
            lineHeight: "140%",
          }}
        >
          오늘은 아직 조용하네요
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
            lineHeight: "155%",
            letterSpacing: "-0.022em",
          }}
        >
          이 날의 첫 번째 잼 세션을
          <br />
          직접 열어보는 건 어떨까요?
        </p>
      </motion.div>
    </motion.div>
  );
}
