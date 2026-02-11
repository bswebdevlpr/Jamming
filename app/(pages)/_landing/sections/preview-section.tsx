"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { fetchJams } from "@/app/lib/functions/fetch";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import {
  STAGGER_CONTAINER,
  STAGGER_ITEM,
  GPU_ACCELERATED_STYLE,
} from "@/app/lib/animations";
import UserProfile from "@/app/ui/images/navbar/user-profile";
import Link from "next/link";

// 샘플 목 데이터
const MOCK_JAMS: Partial<Entity_JamSession>[] = [
  {
    id: "sample-1",
    title: "홍대 인디밴드 잼 세션 🎸",
    location: "서울",
    genre: ["록", "인디"],
    level: "중급",
    datetime: "2025-03-15T19:00:00",
  },
  {
    id: "sample-2",
    title: "강남 재즈 세션 모집 🎷",
    location: "서울",
    genre: ["재즈", "블루스"],
    level: "고급",
    datetime: "2025-03-20T20:00:00",
  },
  {
    id: "sample-3",
    title: "부산 합주 메이트 구해요 🥁",
    location: "부산",
    genre: ["팝", "록"],
    level: "초급",
    datetime: "2025-03-25T18:00:00",
  },
];

interface PreviewSectionProps {
  id?: string;
}

export default function PreviewSection({ id }: PreviewSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const router = useRouter();

  // 실제 데이터 조회
  const { data } = useQuery({
    queryKey: ["preview-jams"],
    queryFn: () =>
      fetchJams({
        pageParam: 0,
        queryFnParam: JSON.stringify({
          selectedDate: moment(),
          location: undefined,
          genre: undefined,
          position: undefined,
          level: undefined,
        }),
      }),
    staleTime: 1000 * 60 * 5,
  });

  // 데이터 없으면 샘플 사용
  const jams = data?.data && data.data.length > 0 ? data.data.slice(0, 5) : MOCK_JAMS;

  return (
    <section
      id={id}
      ref={ref}
      style={{
        padding: "60px 20px 80px",
        background: "var(--background)",
      }}
    >
      {/* 상단 배너 */}
      <div
        style={{
          background: "rgba(163, 255, 12, 0.1)",
          border: "1px solid rgba(163, 255, 12, 0.3)",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#A3FF0C",
            fontFamily: "SUIT-TITLE",
            fontSize: "0.875rem",
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          💡 가입하고 참여하세요!
        </p>
      </div>

      {/* 섹션 타이틀 */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.25rem",
          color: "var(--foreground)",
          letterSpacing: "-0.025em",
          lineHeight: "140%",
          margin: "0 0 24px 0",
          textAlign: "center",
        }}
      >
        이런 세션들이 열려요
      </motion.h2>

      {/* 피드 카드 */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "32px",
          ...GPU_ACCELERATED_STYLE,
        }}
      >
        {jams.map((jam, idx) => (
          <PreviewCard key={jam.id} jam={jam} idx={idx} router={router} />
        ))}
      </motion.div>

      {/* 하단 CTA */}
      <Link href="/signin" style={{ textDecoration: "none" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
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
          whileHover={{ scale: 1.02, backgroundColor: "#3a5218" }}
          whileTap={{ scale: 0.98 }}
        >
          더 많은 세션 보려면 가입하기
        </motion.div>
      </Link>
    </section>
  );
}

function PreviewCard({
  jam,
  idx,
  router,
}: {
  jam: Partial<Entity_JamSession>;
  idx: number;
  router: any;
}) {
  const tags = [
    ...(jam.genre
      ? jam.genre.map((g, i) => <GenreTag key={`genre-${i}`} text={g} />)
      : []),
    ...(jam.level ? [<LevelTag key="level" text={jam.level} />] : []),
  ];

  const handleClick = () => {
    // 로그인 유도
    router.push("/signin");
  };

  return (
    <motion.div
      variants={STAGGER_ITEM}
      onClick={handleClick}
      style={{
        width: "100%",
        padding: "16px",
        background: "var(--deep-bg)",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        cursor: "pointer",
      }}
      whileHover={{
        background: "rgba(163, 255, 12, 0.05)",
        scale: 1.01,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col gap-1.5">
        {/* 제목 */}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            lineHeight: "140%",
            letterSpacing: "-0.384px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "var(--foreground)",
          }}
        >
          {jam.title}
        </p>

        {/* 태그 */}
        <TagList
          tags={
            jam.location
              ? [<LocationTag key="location" text={jam.location} />, ...tags]
              : tags
          }
        />

        {/* 참여 인원 (샘플) */}
        <div className="flex items-center gap-1">
          <UserProfile width={10.7} height={12} />
          <p
            style={{
              color: "#9F9FA2",
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              lineHeight: "140%",
            }}
          >
            <span style={{ color: "var(--highlight)" }}>
              {Math.floor(Math.random() * 3) + 2}
            </span>
            /{Math.floor(Math.random() * 3) + 5}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
