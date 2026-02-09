"use client";

import { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  POPUP_VARIANTS,
  GPU_ACCELERATED_STYLE,
} from "@/app/lib/animations";

export default function PopupTemplate({
  children,
  isTurnedOn,
  className,
  style,
}: {
  children: ReactNode;
  isTurnedOn: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <AnimatePresence>
      {isTurnedOn && (
        <motion.div
          className={`fixed z-10 ${className ?? ""}`}
          style={{
            ...style,

            width: "min(var(--max-width), 100vw)",
            height: "calc(var(--vh, 1vh) * 100)",

            top: 0,
            left: "50%",

            overflow: "auto",

            backgroundColor: style?.backgroundColor || "var(--background)",

            ...GPU_ACCELERATED_STYLE,
            // translateX(-50%) is handled by framer-motion x property below
            // so we do NOT set transform here
          }}
          variants={POPUP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          // Keep the popup horizontally centred via framer-motion's x
          // This avoids conflicting with the scale transform in variants
          custom={{ x: "-50%" }}
          transformTemplate={(_transform, generated: string) =>
            `translateX(-50%) ${generated}`
          }
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
