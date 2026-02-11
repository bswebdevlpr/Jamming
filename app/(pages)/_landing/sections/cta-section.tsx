"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  BUTTON_INTERACTION,
  GPU_ACCELERATED_STYLE,
  DURATION,
  EASING,
} from "@/app/lib/animations";

const ctaContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const ctaItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.smooth,
    },
  },
};

export default function CTASection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      style={{
        padding: "60px 20px 80px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <motion.div
        variants={ctaContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          ...GPU_ACCELERATED_STYLE,
        }}
      >
        <motion.h2
          variants={ctaItem}
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.25rem",
            color: "var(--foreground)",
            letterSpacing: "-0.025em",
            lineHeight: "140%",
            margin: 0,
            textAlign: "center",
          }}
        >
          지금 바로 잼 세션을 찾아보세요
        </motion.h2>

        <motion.p
          variants={ctaItem}
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
            letterSpacing: "-0.025em",
            lineHeight: "150%",
            margin: 0,
            textAlign: "center",
          }}
        >
          회원가입 30초, 무료로 시작
        </motion.p>

        <motion.div
          variants={ctaItem}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            maxWidth: "320px",
            marginTop: "16px",
          }}
        >
          {/* Primary CTA */}
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
              카카오로 시작하기
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
