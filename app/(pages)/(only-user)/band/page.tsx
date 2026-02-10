"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { fetchMyBands } from "./functions/fetch";
import { GenreTag, LevelTag, LocationTag, TagList } from "@/app/ui/tags/category-tag";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import BandIcon from "@/app/ui/images/navbar/band-icon";

interface BandWithRole {
  band: Entity_Band;
  role: string;
}

export default function BandListPage() {
  const router = useRouter();
  const [myBands, setMyBands] = useState<BandWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await fetchMyBands();
      if (result.success) {
        setMyBands(result.data);
      }
      setIsLoading(false);
    })();
  }, []);

  const leaderBands = myBands.filter((b) => b.role === "leader");
  const memberBands = myBands.filter((b) => b.role === "member");

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
          My Band
        </p>
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

      {isLoading ? (
        <div className="flex justify-center items-center grow">
          <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>
            loading...
          </p>
        </div>
      ) : myBands.length === 0 ? (
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
      whileHover={{ background: "rgba(163, 255, 12, 0.12)" }}
      whileTap={{ background: "rgba(163, 255, 12, 0.12)" }}
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
