"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { fetchMyBands, fetchAllBands } from "./functions/fetch";
import { isError } from "@/app/lib/types/result";
import { GenreTag, LevelTag, LocationTag, TagList } from "@/app/ui/tags/category-tag";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import BandIcon from "@/app/ui/images/navbar/band-icon";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { useBottomSheetStore, useSessionStore } from "@/app/stores";
import BandBottomSheetContent from "./bottom-sheet/content";
import FilterButton from "@/app/ui/buttons/filter";
import LocationPopup from "@/app/ui/popup/location";
import { DownArrow } from "@/app/ui/images/arrows";
import { dbLocationToEnum, getLocationDisplay } from "@/app/lib/utils/location";

interface BandWithRole {
  band: Entity_Band;
  role: string;
}

export default function BandListPage() {
  const router = useRouter();
  const bottomSheet = useBottomSheetStore();
  const { userProfile } = useSessionStore();

  const [tab, setTab] = useState<"my" | "all">("my");
  const [genre, setGenre] = useState<GenreEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>();
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 사용자 설정 지역으로 초기화
  useEffect(() => {
    if (userProfile.isLoaded && userProfile.location) {
      const mapped = dbLocationToEnum(userProfile.location);
      setLocation(mapped ?? LocationEnum.Everywhere);
    } else if (userProfile.isLoaded && !userProfile.location) {
      setLocation(LocationEnum.Everywhere);
    }
  }, [userProfile.isLoaded, userProfile.location]);

  // React Query로 데이터 관리
  const { data: bands = [], isLoading, error } = useQuery({
    queryKey: [
      "my-bands",
      { location, genre, level },
    ],
    queryFn: async () => {
      const result = await fetchMyBands({
        location: location ?? undefined,
        genre: genre ?? undefined,
        level: level ?? undefined,
      });
      if (isError(result)) {
        throw new Error(result.error.message ?? "밴드 목록을 불러오는데 실패했습니다");
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  const leaderBands = bands.filter((b) => b.role === "leader");
  const memberBands = bands.filter((b) => b.role === "member");

  // 모든 밴드 무한 스크롤 쿼리
  const {
    data: allBandsData,
    isLoading: allBandsLoading,
    error: allBandsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-bands", { location, genre, level }],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchAllBands(
        { location: location ?? undefined, genre: genre ?? undefined, level: level ?? undefined },
        pageParam
      );
      if (isError(result)) {
        throw new Error(result.error.message ?? "밴드 목록을 불러오는데 실패했습니다");
      }
      return result.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 0,
    enabled: tab === "all", // "모든 밴드" 탭일 때만 활성화
    staleTime: 1000 * 60 * 5,
  });

  const allBands = allBandsData?.pages.flatMap((page) => page.data) ?? [];

  // 무한 스크롤
  useEffect(() => {
    if (tab !== "all") return;
    if (!hasNextPage || isFetchingNextPage) return;
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const element = bottomRef.current;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [tab, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterClick = () => {
    bottomSheet.set({
      children: (
        <BandBottomSheetContent
          genre={genre}
          level={level}
          setGenre={setGenre}
          setLevel={setLevel}
        />
      ),
      location: "middle",
      header: false,
    });
  };

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      {/* Header */}
      <div className="px-5 py-3">
        <div className="flex flex-row justify-between items-center mb-3">
          <p
            style={{
              fontFamily: "SBAggroB",
              fontSize: "1.125rem",
              color: "var(--foreground)",
            }}
          >
            Band
          </p>
          <div className="flex gap-2">
            <ButtonTemplate
              text="+ 밴드 만들기"
              isActive
              onClick={() => router.push("/band/create")}
              className="w-auto"
              type="button"
            />
          </div>
        </div>

        {/* Segment Control */}
        <div
          className="flex mb-3"
          style={{
            background: "#242426",
            borderRadius: "8px",
            padding: "2px",
            border: "1px solid #323234",
          }}
        >
          <button
            onClick={() => setTab("my")}
            style={{
              flex: 1,
              padding: "8px 16px",
              borderRadius: "6px",
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              color: tab === "my" ? "#A3FF0C" : "#9F9FA2",
              background: tab === "my" ? "#323234" : "transparent",
              transition: "all 0.2s",
            }}
            type="button"
          >
            내 밴드
          </button>
          <button
            onClick={() => setTab("all")}
            style={{
              flex: 1,
              padding: "8px 16px",
              borderRadius: "6px",
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              color: tab === "all" ? "#A3FF0C" : "#9F9FA2",
              background: tab === "all" ? "#323234" : "transparent",
              transition: "all 0.2s",
            }}
            type="button"
          >
            모든 밴드
          </button>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div
            className="flex flex-row gap-1 cursor-pointer"
            onClick={() => setIsLocationPopupOpen(true)}
          >
            <p style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1.125rem",
              color: "#FFF",
            }}>
              {getLocationDisplay(location)}
            </p>
            <DownArrow />
          </div>
          <FilterButton onClick={handleFilterClick} />
        </div>
      </div>

      {tab === "my" ? (
        // "내 밴드" 탭
        <>
          {isLoading ? (
            <div className="flex justify-center items-center grow">
              <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>
                loading...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center grow gap-4 px-5">
              <p
                style={{
                  color: "#FF3E2F",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                {error.message}
              </p>
            </div>
          ) : bands.length === 0 ? (
            <div className="flex flex-col justify-center items-center grow gap-4 px-5">
              <BandIcon focused={false} />
              <p
                style={{
                  color: "#9F9FA2",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                {(genre || level || (location && location !== LocationEnum.Everywhere))
                  ? "필터 조건에 맞는 밴드가 없습니다."
                  : "아직 참여 중인 밴드가 없습니다.\n밴드를 만들거나 구인 게시판에서 밴드에 지원해보세요!"}
              </p>
            </div>
          ) : (
            <div className="px-5 pb-20 overflow-without-scroll">
              {/* 내 밴드 (리더) */}
              {leaderBands.length > 0 && (
                <div className="mb-6">
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: "SBAggroB",
                      fontSize: "0.875rem",
                      color: "#A3FF0C",
                    }}
                  >
                    My Band
                  </p>
                  <motion.div
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-2"
                  >
                    {leaderBands.map(({ band }) => (
                      <BandCard
                        key={band.id}
                        band={band}
                        isLeader
                        onClick={() => router.push(`/band/${band.id}`)}
                      />
                    ))}
                  </motion.div>
                </div>
              )}

              {/* 참여 밴드 (멤버) */}
              {memberBands.length > 0 && (
                <div>
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: "SBAggroB",
                      fontSize: "0.875rem",
                      color: "#9F9FA2",
                    }}
                  >
                    Joined Band
                  </p>
                  <motion.div
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-2"
                  >
                    {memberBands.map(({ band }) => (
                      <BandCard
                        key={band.id}
                        band={band}
                        isLeader={false}
                        onClick={() => router.push(`/band/${band.id}`)}
                      />
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // "모든 밴드" 탭
        <>
          {allBandsLoading ? (
            <div className="flex justify-center items-center grow">
              <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>
                loading...
              </p>
            </div>
          ) : allBandsError ? (
            <div className="flex flex-col justify-center items-center grow gap-4 px-5">
              <p
                style={{
                  color: "#FF3E2F",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                {allBandsError.message}
              </p>
            </div>
          ) : allBands.length === 0 ? (
            <div className="flex flex-col justify-center items-center grow gap-4 px-5">
              <BandIcon focused={false} />
              <p
                style={{
                  color: "#9F9FA2",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                {(genre || level || (location && location !== LocationEnum.Everywhere))
                  ? "필터 조건에 맞는 밴드가 없습니다."
                  : "등록된 밴드가 없습니다."}
              </p>
            </div>
          ) : (
            <div className="px-5 pb-20 overflow-without-scroll">
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2"
              >
                {allBands.map((band) => (
                  <BandCard
                    key={band.id}
                    band={band}
                    isLeader={false}
                    onClick={() => router.push(`/band/${band.id}`)}
                  />
                ))}
              </motion.div>

              {/* 무한 스크롤 로더 */}
              {hasNextPage && (
                <div ref={bottomRef} className="py-4 text-center">
                  {isFetchingNextPage ? (
                    <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY", fontSize: "0.875rem" }}>
                      loading...
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <LocationPopup
        isTurnedOn={isLocationPopupOpen}
        turnOff={() => setIsLocationPopupOpen(false)}
        setLocation={setLocation}
      />
    </div>
  );
}

function BandCard({
  band,
  isLeader,
  onClick,
}: {
  band: Entity_Band;
  isLeader: boolean;
  onClick: () => void;
}) {
  const tags = [
    ...(band.location
      ? [<LocationTag key="loc" text={band.location} />]
      : []),
    ...(band.genre
      ? band.genre.map((g, i) => <GenreTag key={`g-${i}`} text={g} />)
      : []),
    ...(band.level ? [<LevelTag key="lvl" text={band.level} />] : []),
  ];

  return (
    <motion.div
      variants={STAGGER_ITEM}
      className="w-full flex items-center gap-3 py-3 px-3"
      style={{
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        borderRadius: "4px",
      }}
      onClick={onClick}
      whileHover={{ background: "rgba(163, 255, 12, 0.05)" }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 아바타 */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#242426",
          border: isLeader ? "1px solid rgba(108, 158, 255, 0.5)" : "1px solid #323234",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {band.profile_image ? (
          <img
            src={band.profile_image}
            alt={band.name ?? ""}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "1.25rem", color: "#535355" }}>♪</span>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-1.5" style={{ minWidth: 0, flex: 1 }}>
        <div className="flex gap-2 items-center">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              lineHeight: "140%",
              letterSpacing: "-0.384px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {band.name}
          </p>
          {isLeader && (
            <span
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.625rem",
                color: "#A3FF0C",
                background: "rgba(163, 255, 12, 0.16)",
                padding: "1px 6px",
                borderRadius: "2px",
              }}
            >
              Leader
            </span>
          )}
        </div>
        <TagList tags={tags} />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
          }}
        >
          {band.memberCount ?? 0}명
        </p>
      </div>
    </motion.div>
  );
}
