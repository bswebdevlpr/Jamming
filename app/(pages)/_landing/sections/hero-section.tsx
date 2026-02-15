"use client";

import {
  GPU_ACCELERATED_STYLE,
  POPUP_VARIANTS,
  SLIDE_VARIANTS
} from "@/app/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";

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
            alt="JAMMING Logo"
            width={100}
            height={92}
            priority
          />
        </motion.div>

        {/* Brand Name with SEO-optimized H1 */}
        <motion.h1
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "24px",
            color: "var(--foreground)",
            letterSpacing: "-0.025em",
            lineHeight: "140%",
            margin: 0,
            textAlign: "center",
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          음악인을 위한 합주 매칭 플랫폼{" "}
          <span
            style={{
              fontFamily: "SBAggroM",
              fontSize: "42px",
              color: "var(--highlight)",
              letterSpacing: "0",
              display: "inline-block",
            }}
          >
            JAMMING
          </span>
        </motion.h1>

        {/* App Description */}
        <motion.p
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "14px",
            color: "#9F9FA2",
            letterSpacing: "-0.025em",
            lineHeight: "150%",
            margin: "16px 0 0 0",
            textAlign: "center",
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          지역·장르·레벨별로 딱 맞는 합주 파트너를 찾고
          <br />
          밴드를 관리하고 음악인 커뮤니티를 만드세요
        </motion.p>

        {/* Slogan */}
        <motion.p
          variants={SLIDE_VARIANTS.fromBottom}
          style={{
            fontFamily: "SBAggroM",
            fontSize: "20px",
            color: "var(--foreground)",
            letterSpacing: "0",
            lineHeight: "140%",
            margin: 0,
            ...GPU_ACCELERATED_STYLE,
          }}
        >
          놀기 위해 모였다!
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          variants={SLIDE_VARIANTS.fromBottom}
          onClick={() => {
            const nextSection = document.querySelector(
              "section:nth-of-type(2)",
            );
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollBy({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }
          }}
          style={{
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
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
      </motion.div>
    </section>
  );
}
