"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  fetchRecruitPosts,
  Filter_RecruitFeed,
} from "./functions/fetch";
import { Entity_RecruitPost } from "@/app/lib/interfaces/entity.interface";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import RecruitIcon from "@/app/ui/images/navbar/recruit-icon";

export default function RecruitFeedPage() {
  const router = useRouter();
  const { ref: scrollRef, inView } = useInView();

  const [filter, setFilter] = useState<Filter_RecruitFeed>({});

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["recruit-posts", JSON.stringify(filter)],
    queryFn: ({ pageParam = 0 }) =>
      fetchRecruitPosts({
        pageParam,
        queryFnParam: JSON.stringify(filter),
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isLoading, fetchNextPage]);

  const allPosts =
    data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      {/* Header */}
      <div className="flex flex-row justify-between items-center px-5 py-3">
        <p
          style={{
            fontFamily: "SBAggroB",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          Recruit
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto overflow-without-scroll">
        <FilterSelect
          label="지역"
          value={filter.location ?? ""}
          options={Object.values(LocationEnum)}
          onChange={(v) =>
            setFilter((prev) => ({
              ...prev,
              location: v ? (v as LocationEnum) : undefined,
            }))
          }
        />
        <FilterSelect
          label="장르"
          value={filter.genre ?? ""}
          options={Object.values(GenreEnum)}
          onChange={(v) =>
            setFilter((prev) => ({
              ...prev,
              genre: v ? (v as GenreEnum) : undefined,
            }))
          }
        />
        <FilterSelect
          label="실력"
          value={filter.level ?? ""}
          options={Object.values(LevelEnum)}
          onChange={(v) =>
            setFilter((prev) => ({
              ...prev,
              level: v ? (v as LevelEnum) : undefined,
            }))
          }
        />
        <FilterSelect
          label="포지션"
          value={filter.pos ?? ""}
          options={Object.values(PositionEnum)}
          onChange={(v) =>
            setFilter((prev) => ({
              ...prev,
              pos: v ? (v as PositionEnum) : undefined,
            }))
          }
        />
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="flex justify-center items-center grow">
          <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>loading...</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="flex flex-col justify-center items-center grow gap-4 px-5">
          <RecruitIcon focused={false} />
          <p
            style={{
              color: "#9F9FA2",
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            아직 등록된 구인글이 없습니다.
          </p>
        </div>
      ) : (
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="px-5 pb-20 overflow-without-scroll"
        >
          {allPosts.map((post, idx) => (
            <RecruitFeedItem
              key={post.id}
              post={post}
              idx={idx}
              onClick={() => router.push(`/recruit/post/${post.id}`)}
            />
          ))}
          <div
            ref={scrollRef}
            style={{ height: 20, background: "transparent" }}
          />
        </motion.div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#323234",
        border: "1px solid #444447",
        borderRadius: "4px",
        padding: "4px 8px",
        color: value ? "#A3FF0C" : "#9F9FA2",
        fontFamily: "SUIT-BODY",
        fontSize: "16px",
        flexShrink: 0,
      }}
      aria-label={`${label} 필터`}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function RecruitFeedItem({
  post,
  idx,
  onClick,
}: {
  post: Entity_RecruitPost;
  idx: number;
  onClick: () => void;
}) {
  const positions = (post.positions ?? []) as {
    pos: string;
    headcnt: number;
  }[];

  const tags = [
    ...(post.location ? [<LocationTag key="loc" text={post.location} />] : []),
    ...(positions.length > 0
      ? positions.map((p, i) => <PositionTag key={`p-${i}`} text={p.pos} />)
      : []),
    ...(post.genre
      ? post.genre.map((g, i) => <GenreTag key={`g-${i}`} text={g} />)
      : []),
    ...(post.level
      ? post.level.map((l, i) => <LevelTag key={`l-${i}`} text={l} />)
      : []),
  ];

  return (
    <motion.div
      variants={STAGGER_ITEM}
      className="w-full flex flex-col gap-1.5 py-3"
      style={{
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
      onClick={onClick}
      whileHover={{ background: "rgba(163, 255, 12, 0.12)" }}
      whileTap={{ background: "rgba(163, 255, 12, 0.12)" }}
    >
      <div className="flex items-center gap-2">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            lineHeight: "140%",
            letterSpacing: "-0.384px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {post.title}
        </p>
        {!post.is_active && (
          <span
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              color: "#FF3E2F",
              background: "rgba(255, 62, 47, 0.2)",
              padding: "1px 6px",
              borderRadius: "2px",
              flexShrink: 0,
            }}
          >
            마감
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
          }}
        >
          {post.band?.name ?? "밴드"}
        </p>
        <span
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#535355",
          }}
        >
          |
        </span>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
          }}
        >
          조회 {post.view_count ?? 0}
        </p>
        <span
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#535355",
          }}
        >
          |
        </span>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
          }}
        >
          지원 {post.commentCount ?? (post as any).recruit_comment?.length ?? 0}
        </p>
      </div>
      <TagList tags={tags} />
    </motion.div>
  );
}
