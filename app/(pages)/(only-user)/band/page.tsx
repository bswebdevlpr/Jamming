"use client";

import { useState, useEffect } from "react";
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

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>();
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);

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
  const { data: bands = [], isLoading } = useQuery({
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
      if (result.success) {
        return result.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  const leaderBands = bands.filter((b) => b.role === "leader");
  const memberBands = bands.filter((b) => b.role === "member");

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
            My Band
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

      {isLoading ? (
        <div className="flex justify-center items-center grow">
          <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>
            loading...
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
            {(genre || level || location)
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
