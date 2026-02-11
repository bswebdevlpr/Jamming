"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { STAGGER_ITEM, GPU_ACCELERATED_STYLE } from "@/app/lib/animations";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tags?: ReactNode;
}

export default function FeatureCard({
  icon,
  title,
  description,
  tags,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={STAGGER_ITEM}
      style={{
        background: "var(--deep-bg)",
        borderRadius: "8px",
        padding: "20px",
        ...GPU_ACCELERATED_STYLE,
      }}
    >
      <div className="flex flex-col gap-3">
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(163, 255, 12, 0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {icon}
        </div>
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
        {tags && <div className="flex flex-wrap gap-1 mt-1">{tags}</div>}
      </div>
    </motion.div>
  );
}
