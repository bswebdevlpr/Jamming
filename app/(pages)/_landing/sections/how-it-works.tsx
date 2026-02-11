"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  STAGGER_CONTAINER,
  GPU_ACCELERATED_STYLE,
} from "@/app/lib/animations";
import StepCard from "../components/step-card";

const STEPS = [
  {
    stepNumber: 1,
    title: "가입하기",
    description: "카카오 또는 구글 계정으로 30초 만에 간편하게 가입하세요.",
  },
  {
    stepNumber: 2,
    title: "세션 찾기",
    description: "날짜, 지역, 장르를 선택해 원하는 잼 세션을 탐색하세요.",
  },
  {
    stepNumber: 3,
    title: "합주하기",
    description: "마음에 드는 세션에 신청하고, 승인받으면 합주를 시작하세요!",
  },
];

export default function HowItWorksSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section
      ref={ref}
      style={{
        padding: "60px 20px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          ...GPU_ACCELERATED_STYLE,
        }}
      >
        <h2
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.25rem",
            color: "var(--foreground)",
            letterSpacing: "-0.025em",
            lineHeight: "140%",
            margin: 0,
          }}
        >
          3단계로 시작하세요
        </h2>

        {STEPS.map((step) => (
          <StepCard
            key={step.stepNumber}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
          />
        ))}
      </motion.div>
    </section>
  );
}
