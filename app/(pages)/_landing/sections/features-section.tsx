"use client";

import { GPU_ACCELERATED_STYLE, STAGGER_CONTAINER } from "@/app/lib/animations";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import FeatureCard from "../components/feature-card";
import { LandingTag } from "../components/landing-tag";

const FEATURES = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 2C7.79 2 6 3.79 6 6C6 9.5 10 14 10 14C10 14 14 9.5 14 6C14 3.79 12.21 2 10 2ZM10 7.5C9.17 7.5 8.5 6.83 8.5 6C8.5 5.17 9.17 4.5 10 4.5C10.83 4.5 11.5 5.17 11.5 6C11.5 6.83 10.83 7.5 10 7.5Z"
          fill="#A3FF0C"
        />
        <path
          d="M3 17L5 15H15L17 17"
          stroke="#A3FF0C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "잼 세션",
    description:
      "합주 모집/참가, 날짜/지역/장르별 필터링으로 딱 맞는 세션을 찾아보세요.",
    tags: (
      <>
        <LandingTag text="락" />
        <LandingTag text="팝" />
        <LandingTag text="기타" />
        <LandingTag text="드럼" />
      </>
    ),
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 10C11.66 10 13 8.66 13 7C13 5.34 11.66 4 10 4C8.34 4 7 5.34 7 7C7 8.66 8.34 10 10 10Z"
          fill="#A3FF0C"
        />
        <path
          d="M4 16C4 13.24 6.69 11 10 11C13.31 11 16 13.24 16 16"
          stroke="#A3FF0C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M15 4L17 6L15 8"
          stroke="#A3FF0C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "밴드 관리",
    description:
      "내 밴드를 만들고 멤버를 관리하세요. 리더와 멤버 역할 구분까지.",
    tags: (
      <>
        <LandingTag text="리더" />
        <LandingTag text="멤버" />
      </>
    ),
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="14"
          height="14"
          rx="2"
          stroke="#A3FF0C"
          strokeWidth="1.5"
        />
        <path
          d="M7 7H13M7 10H13M7 13H10"
          stroke="#A3FF0C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "구인 게시판",
    description:
      "밴드 멤버를 구하거나, 원하는 밴드에 지원하세요. 포지션별 모집도 가능합니다.",
    tags: (
      <>
        <LandingTag text="보컬" />
        <LandingTag text="베이스" />
        <LandingTag text="키보드" />
      </>
    ),
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="7" stroke="#A3FF0C" strokeWidth="1.5" />
        <path
          d="M10 3C10 3 7 7 7 10C7 13 10 17 10 17C10 17 13 13 13 10C13 7 10 3 10 3Z"
          stroke="#A3FF0C"
          strokeWidth="1.5"
        />
        <path d="M3 10H17" stroke="#A3FF0C" strokeWidth="1.5" />
      </svg>
    ),
    title: "전국 어디서나",
    description:
      "서울부터 제주까지, 전국 19개 지역에서 내 근처 세션을 찾아보세요.",
    tags: (
      <>
        <LandingTag text="서울" />
        <LandingTag text="경기" />
        <LandingTag text="부산" />
      </>
    ),
  },
];

export default function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section
      ref={ref}
      aria-label="JAMMING 주요 기능"
      style={{
        padding: "60px 20px",
      }}
    >
      <h2
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.25rem",
          color: "var(--foreground)",
          letterSpacing: "-0.025em",
          lineHeight: "140%",
          margin: "0 0 24px 0",
        }}
      >
        이런 것들이 가능해요
      </h2>

      <motion.ol
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          listStyle: "none",
          margin: 0,
          padding: 0,
          ...GPU_ACCELERATED_STYLE,
        }}
      >
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tags={feature.tags}
            />
          </li>
        ))}
      </motion.ol>
    </section>
  );
}
