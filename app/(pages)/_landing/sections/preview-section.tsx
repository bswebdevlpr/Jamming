"use client";

import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
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
import { GPU_ACCELERATED_STYLE } from "@/app/lib/animations";
import UserProfile from "@/app/ui/images/navbar/user-profile";
import Logo from "@/app/ui/images/logo";
import { ImageWithTxt } from "@/app/ui/templates/images";

// Preview Section 전용 부드러운 애니메이션
const PREVIEW_STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 각 카드 간격 100ms (더 여유롭게)
      delayChildren: 0.15,   // 초기 지연
    },
  },
};

const PREVIEW_STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 6 },  // 미묘한 위치 변화
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,  // 더 부드러운 전환
      ease: [0.25, 0.1, 0.25, 1],  // 더 자연스러운 easing
    },
  },
};

// 샘플 목 데이터 (실제 DB 형식과 일치)
const MOCK_JAMS = [
  {
    id: -1,
    title: "홍대 인디밴드 잼 세션",
    location: "su",        // 서울 (단축 코드)
    genre: "r",            // 락 (단일값)
    level: "a",            // 아마추어
    datetime: moment().add(7, "days").hour(19).minute(0).second(0).toISOString(),
    thumbnail: null,       // Logo 폴백 사용
    curHeadCnt: 3,
    maxHeadCnt: 6,
  },
  {
    id: -2,
    title: "강남 재즈 세션 모집",
    location: "su",
    genre: "j",            // 재즈
    level: "p",            // 프로
    datetime: moment().add(12, "days").hour(20).minute(0).second(0).toISOString(),
    thumbnail: null,
    curHeadCnt: 2,
    maxHeadCnt: 5,
  },
  {
    id: -3,
    title: "부산 합주 메이트 구해요",
    location: "bs",        // 부산
    genre: "po",           // 팝
    level: "h",            // 취미
    datetime: moment().add(17, "days").hour(18).minute(0).second(0).toISOString(),
    thumbnail: null,
    curHeadCnt: 4,
    maxHeadCnt: 7,
  },
];

export default function PreviewSection() {
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
      ref={ref}
      aria-label="잼 세션 미리보기"
      style={{
        padding: "60px 20px 80px",
        background: "var(--background)",
      }}
    >
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
        variants={PREVIEW_STAGGER_CONTAINER}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          ...GPU_ACCELERATED_STYLE,
        }}
      >
        {jams.map((jam) => (
          <PreviewCard key={jam.id} jam={jam} router={router} />
        ))}
      </motion.div>
    </section>
  );
}

interface MockJam {
  id: number;
  title: string;
  location: string;
  genre: string;
  level: string;
  datetime: string;
  thumbnail: null;
  curHeadCnt: number;
  maxHeadCnt: number;
}

type PreviewJam = MockJam | Entity_JamSession;

function isMockJam(jam: PreviewJam): jam is MockJam {
  return 'thumbnail' in jam;
}

function PreviewCard({
  jam,
  router,
}: {
  jam: PreviewJam;
  router: AppRouterInstance;
}) {
  // genre를 단일값으로 처리
  const genre = isMockJam(jam)
    ? jam.genre
    : jam.genre;

  const tags = [
    ...(genre ? [<GenreTag key="genre" text={genre} />] : []),
    ...(jam.level ? [<LevelTag key="level" text={jam.level} />] : []),
  ];

  const curHeadCnt = isMockJam(jam) ? jam.curHeadCnt : (jam.curHeadCnt ?? 0);
  const maxHeadCnt = isMockJam(jam) ? jam.maxHeadCnt : (jam.maxHeadCnt ?? 0);
  const thumbnail = isMockJam(jam) ? jam.thumbnail : null;

  return (
    <motion.div
      variants={PREVIEW_STAGGER_ITEM}
      onClick={() => router.push("/signin")}
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
      {/* 좌우 레이아웃 (FeedItem_Jam과 동일) */}
      <div className="w-full flex justify-between">
        {/* 좌측: 제목 + 태그 + 참여인원 */}
        <div className="flex flex-col gap-1.5" style={{ minWidth: 0, flex: 1 }}>
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

          <TagList
            tags={
              jam.location
                ? [<LocationTag key="location" text={jam.location} />, ...tags]
                : tags
            }
          />

          <ImageWithTxt
            className="gap-1"
            image={<UserProfile width={10.7} height={12} />}
            text={
              <p
                style={{
                  color: "#9F9FA2",
                  fontFamily: "SUIT-TITLE",
                  fontSize: "0.875rem",
                  lineHeight: "140%",
                }}
              >
                <span style={{ color: "var(--highlight)" }}>
                  {curHeadCnt}
                </span>
                /{maxHeadCnt}
              </p>
            }
          />
        </div>

        {/* 우측: 썸네일 (72x72) */}
        <div className="flex items-center">
          {thumbnail ? (
            <div style={{ width: "72px", height: "72px", position: "relative" }}>
              <Image
                src={thumbnail}
                alt="session thumbnail"
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <Logo width={72} height={72} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
