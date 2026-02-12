"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { fetchMyBands } from "./functions/fetch";
import { GenreTag, LevelTag, LocationTag, TagList } from "@/app/ui/tags/category-tag";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import BandIcon from "@/app/ui/images/navbar/band-icon";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { useBottomSheetStore } from "@/app/stores";
import BandBottomSheetContent from "./bottom-sheet/content";
import FilterButton from "@/app/ui/buttons/filter";

interface BandWithRole {
  band: Entity_Band;
  role: string;
}

export default function BandListPage() {
  const router = useRouter();
  const bottomSheet = useBottomSheetStore();

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>(null);

  // React Query로 데이터 관리
  const { data: allBands = [], isLoading } = useQuery({
    queryKey: ["my-bands"],
    queryFn: async () => {
      const result = await fetchMyBands();
      if (result.success) {
        return result.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 클라이언트 필터링
  const filteredBands = allBands.filter((b) => {
    if (genre && !b.band.genre?.includes(genre)) return false;
    if (level && b.band.level !== level) return false;
    if (location && b.band.location !== location) return false;
    return true;
  });

  const leaderBands = filteredBands.filter((b) => b.role === "leader");
  const memberBands = filteredBands.filter((b) => b.role === "member");

  const handleFilterClick = () => {
    bottomSheet.set({
      children: (
        <BandBottomSheetContent
          genre={genre}
          level={level}
          location={location}
          setGenre={setGenre}
          setLevel={setLevel}
          setLocation={setLocation}
        />
      ),
      location: "middle",
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
          My Band
        </p>
        <div className="flex gap-2">
          <FilterButton onClick={handleFilterClick} />
          <ButtonTemplate
            text="+ 밴드 만들기"
            isActive
            onClick={() => router.push("/band/create")}
            className="w-auto"
            style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            styleActivated={{ padding: "6px 14px", fontSize: "0.8rem" }}
            type="button"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center grow">
          <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>
            loading...
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
            아직 참여 중인 밴드가 없습니다.
            <br />
            밴드를 만들거나 구인 게시판에서 밴드에 지원해보세요!
          </p>
        </div>
      ) : filteredBands.length === 0 ? (
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
            필터 조건에 맞는 밴드가 없습니다.
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
      className="w-full flex justify-between items-center py-3 px-3"
      style={{
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        borderRadius: "4px",
      }}
      onClick={onClick}
      whileHover={{ background: "rgba(163, 255, 12, 0.05)" }}
      whileTap={{ scale: 0.98 }}
    >
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
