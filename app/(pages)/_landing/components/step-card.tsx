"use client";

import { motion } from "framer-motion";
import { STAGGER_ITEM, GPU_ACCELERATED_STYLE } from "@/app/lib/animations";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
}

export default function StepCard({
  stepNumber,
  title,
  description,
}: StepCardProps) {
  return (
    <motion.article
      variants={STAGGER_ITEM}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "16px",
        ...GPU_ACCELERATED_STYLE,
      }}
    >
      <div
        aria-label={`단계 ${stepNumber}`}
        style={{
          fontFamily: "SBAggroB",
          fontSize: "1.5rem",
          color: "var(--highlight)",
          lineHeight: "140%",
          flexShrink: 0,
          width: "32px",
          textAlign: "center",
        }}
      >
        {stepNumber}
      </div>
      <div className="flex flex-col gap-1">
        <h3
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "var(--foreground)",
            letterSpacing: "-0.025em",
            lineHeight: "140%",
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
            letterSpacing: "-0.025em",
            lineHeight: "150%",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </motion.article>
  );
}
