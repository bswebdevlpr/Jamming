"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  POPUP_VARIANTS,
  SLIDE_VARIANTS,
  BUTTON_INTERACTION,
  GPU_ACCELERATED_STYLE,
  DURATION,
  EASING,
} from "@/app/lib/animations";

const heroContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export default function HeroSection() {
  return (
    <section
      style={{
        height: "calc(var(--vh) * 100)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "0 20px",
      }}
    >
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Logo */}
        <motion.div variants={POPUP_VARIANTS} style={GPU_ACCELERATED_STYLE}>
          <Image
            src="/logo.svg"
            alt="Jamming Logo"
            width={100}
            height={92}
            priority
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            fontFamily: "SBAggroM",
            fontSize: "50px",
            color: "var(--highlight)",
            letterSpacing: "0",
            lineHeight: "140%",
            margin: 0,
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          JAMMING
        </motion.h1>

        {/* Slogan */}
        <motion.p
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            fontFamily: "SBAggroM",
            fontSize: "24px",
            color: "var(--foreground)",
            letterSpacing: "0",
            lineHeight: "140%",
            margin: 0,
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          놀기 위해 모였다!
        </motion.p>

        {/* Sub Title */}
        <motion.p
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "14px",
            color: "#C0C0C5",
            letterSpacing: "-0.025em",
            lineHeight: "150%",
            margin: 0,
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          음악인을 위한 합주 매칭 플랫폼
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "280px",
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          <Link href="/signin" style={{ textDecoration: "none" }}>
            <motion.div
              style={{
                width: "100%",
                borderRadius: "8px",
                padding: "14px 12px",
                fontFamily: "SUIT-BODY",
                fontSize: "1rem",
                color: "var(--highlight)",
                border: "1px solid var(--highlight)",
                backgroundColor: "#304313",
                textAlign: "center",
                cursor: "pointer",
              }}
              whileHover={BUTTON_INTERACTION.whileHover}
              whileTap={BUTTON_INTERACTION.whileTap}
              transition={BUTTON_INTERACTION.transition}
            >
              지금 시작하기
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: DURATION.slow, ease: EASING.smooth }}
        style={{
          position: "absolute",
          bottom: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
            margin: 0,
          }}
        >
          스크롤하여 더 알아보기
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 4L10 16M10 16L5 11M10 16L15 11"
              stroke="#9F9FA2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
