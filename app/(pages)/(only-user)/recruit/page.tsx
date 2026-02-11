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
import { useBottomSheetStore } from "@/app/stores";
import RecruitBottomSheetContent from "./bottom-sheet/content";
import FilterButton from "@/app/ui/buttons/filter";

export default function RecruitFeedPage() {
  const router = useRouter();
  const { ref: scrollRef, inView } = useInView();
  const bottomSheet = useBottomSheetStore();

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>(null);

  const [filter, setFilter] = useState<Filter_RecruitFeed>({});

  useEffect(() => {
    setFilter({
      location: location ?? undefined,
      genre: genre ?? undefined,
      pos: position ?? undefined,
      level: level ?? undefined,
    });
  }, [location, genre, position, level]);

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

  const handleFilterClick = () => {
    bottomSheet.set({
      children: (
        <RecruitBottomSheetContent
          genre={genre}
          position={position}
          level={level}
          location={location}
          setGenre={setGenre}
          setPosition={setPosition}
          setLevel={setLevel}
          setLocation={setLocation}
        />
      ),
      location: "medium",
      header: false,
    });
  };

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      {/* Header */}
      <div className="flex flex-row justify-between items-center px-5 py-3">
        <p
          style={{
            fontFamily: "SBAggroB",
            fontSize: "1.125rem",
            color: "var(--foreground)",
          }}
        >
          Recruit
        </p>
        <FilterButton onClick={handleFilterClick} />
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
      whileHover={{ background: "rgba(163, 255, 12, 0.05)" }}
      whileTap={{ scale: 0.98 }}
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
          지원 {post.commentCount ?? post.recruit_comment?.length ?? 0}
        </p>
      </div>
      <TagList tags={tags} />
    </motion.div>
  );
}
