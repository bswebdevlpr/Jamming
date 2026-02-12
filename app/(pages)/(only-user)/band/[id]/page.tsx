"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getBand } from "@/app/api/functions/band/read";
import { deleteBand } from "@/app/api/functions/band/delete";
import { leaveBand } from "@/app/api/functions/band/member";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { useSessionStore } from "@/app/stores";
import { GenreTag, LevelTag, LocationTag, TagList } from "@/app/ui/tags/category-tag";
import { PositionTag } from "@/app/ui/tags/category-tag";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import { toast } from "@/app/ui/components/toast";

export default function BandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bandId = Number(params.id);
  const { userProfile } = useSessionStore();
  const queryClient = useQueryClient();

  // React Query로 밴드 데이터 관리
  const {
    data: band,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["band", bandId],
    queryFn: () => getBand(bandId),
    staleTime: 1000 * 60 * 5, // 5분
    retry: false, // 에러 시 재시도 안 함
  });

  // 에러 발생 시 목록으로 리다이렉트
  if (error) {
    router.push("/band");
    return null;
  }

  const isLeader = band?.leader_id === userProfile.id;

  const handleDelete = async () => {
    if (!confirm("정말 밴드를 삭제하시겠습니까? 모든 데이터가 삭제됩니다.")) return;
    const result = await deleteBand(bandId);
    if (result.success) {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["my-bands"] });
      router.push("/band");
    } else if (result.success === false) {
      toast.error(result.error.message);
    }
  };

  const handleLeave = async () => {
    if (!confirm("밴드를 탈퇴하시겠습니까?")) return;
    const result = await leaveBand(bandId);
    if (result.success) {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["my-bands"] });
      router.push("/band");
    } else if (result.success === false) {
      toast.error(result.error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="grow flex justify-center items-center">
        <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>loading...</p>
      </div>
    );
  }

  if (!band) return null;

  const tags = [
    ...(band.location ? [<LocationTag key="loc" text={band.location} />] : []),
    ...(band.genre
      ? band.genre.map((g, i) => <GenreTag key={`g-${i}`} text={g} />)
      : []),
    ...(band.level ? [<LevelTag key="lvl" text={band.level} />] : []),
  ];

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      {/* Header */}
      <div className="flex items-center px-5 py-3">
        <button
          onClick={() => router.back()}
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          type="button"
          aria-label="뒤로가기"
        >
          &lt; 뒤로
        </button>
        <p
          className="flex-1 text-center"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {band.name}
        </p>
        <div style={{ width: "40px" }}>
          {isLeader && (
            <button
              onClick={() => router.push(`/band/${bandId}/edit`)}
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#A3FF0C",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              type="button"
            >
              수정
            </button>
          )}
        </div>
      </div>

      {/* Band Info */}
      <div className="px-5 pb-4">
        <TagList tags={tags} />
        {band.description && (
          <p
            className="mt-3"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#c0c0c5",
              lineHeight: "150%",
              whiteSpace: "pre-wrap",
            }}
          >
            {band.description}
          </p>
        )}
        {band.tags && band.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {band.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.75rem",
                  color: "#9F9FA2",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Members */}
      <div className="px-5 pb-4">
        <p
          className="mb-3"
          style={{
            fontFamily: "SBAggroB",
            fontSize: "0.875rem",
            color: "#A3FF0C",
          }}
        >
          Members ({band.band_member?.length ?? 0})
        </p>
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1"
        >
          {band.band_member?.map((member) => (
            <motion.div
              key={member.id}
              variants={STAGGER_ITEM}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#323234",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {member.user?.profile_image ? (
                    <img
                      src={member.user.profile_image}
                      alt={member.user.nickname ?? ""}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "SUIT-BODY",
                        fontSize: "0.75rem",
                        color: "#9F9FA2",
                      }}
                    >
                      {(member.user?.nickname ?? "?")[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        fontFamily: "SUIT-BODY",
                        fontSize: "0.875rem",
                        color: "#ededed",
                      }}
                    >
                      {member.user?.nickname ?? "알 수 없음"}
                    </p>
                    {member.role === "leader" && (
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
                  <PositionTag text={member.pos} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-6 mt-auto flex flex-col gap-2">
        {isLeader ? (
          <>
            <ButtonTemplate
              text="구인글 작성하기"
              isActive
              onClick={() =>
                router.push(`/recruit/write?band_id=${bandId}`)
              }
              type="button"
            />
            <button
              onClick={handleDelete}
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#FF3E2F",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
              }}
              type="button"
            >
              밴드 삭제
            </button>
          </>
        ) : (
          <button
            onClick={handleLeave}
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#FF3E2F",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
            type="button"
          >
            밴드 탈퇴
          </button>
        )}
      </div>
    </div>
  );
}
