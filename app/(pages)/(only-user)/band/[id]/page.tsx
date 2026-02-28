"use client";

import { useState, type CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchBand } from "../functions/fetch";
import { deleteBand } from "@/app/api/functions/band/delete";
import { leaveBand } from "@/app/api/functions/band/member";
import { useSessionStore } from "@/app/stores";
import { isError } from "@/app/lib/types/result";
import { GenreTag, LevelTag, LocationTag } from "@/app/ui/tags/category-tag";
import { PositionTag } from "@/app/ui/tags/category-tag";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import { toast } from "@/app/ui/components/toast";

// 색상 상수
const COLORS = {
  band: {
    primary: "#6C9EFF",
    background: "rgba(100, 150, 255, 0.15)",
    border: "rgba(108, 158, 255, 0.3)",
    hover: "rgba(108, 158, 255, 0.05)",
  },
} as const;

// 섹션 라벨 스타일
const SECTION_LABEL_STYLE = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  gap: "4px",
  fontFamily: "SUIT-BODY",
  fontSize: "0.625rem",
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  padding: "2px 8px",
  borderRadius: "4px",
  marginBottom: "12px",
  background: COLORS.band.background,
  color: COLORS.band.primary,
  border: `1px solid ${COLORS.band.border}`,
};

const INFO_LABEL_STYLE = {
  fontFamily: "SUIT-BODY",
  fontSize: "0.625rem",
  color: "#9F9FA2",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const ACTION_BUTTON_BASE: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  fontFamily: "SUIT-BODY",
  fontSize: "1rem",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
};

export default function BandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bandId = params.id as string;
  const { userProfile } = useSessionStore();
  const queryClient = useQueryClient();

  // React Query로 밴드 데이터 관리
  const {
    data: band,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["band", bandId],
    queryFn: async () => {
      const result = await fetchBand(bandId);
      if (isError(result)) throw new Error(result.error.message);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: false, // 에러 시 재시도 안 함
  });

  // 에러 발생 시 에러 UI 표시
  if (error) {
    return (
      <div className="grow flex flex-col justify-center items-center gap-4 px-5">
        <p
          style={{
            color: "#FF3E2F",
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          밴드 정보를 불러올 수 없습니다.
        </p>
        <button
          onClick={() => router.push("/band")}
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: "pointer",
            background: "rgba(163, 255, 12, 0.12)",
            color: "#A3FF0C",
            border: "1px solid #A3FF0C",
          }}
          type="button"
        >
          목록으로
        </button>
      </div>
    );
  }

  const isLeader = band?.leader_id === userProfile.id;
  const isMember = band?.band_member?.some((m) => m.user_id === userProfile.id) ?? false;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (isSubmitting) return;
    if (!confirm("정말 밴드를 삭제하시겠습니까? 모든 데이터가 삭제됩니다.")) return;
    setIsSubmitting(true);
    const result = await deleteBand(bandId);
    if (isError(result)) {
      toast.error(result.error.message);
      setIsSubmitting(false);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-bands"] });
    queryClient.invalidateQueries({ queryKey: ["all-bands"] });
    toast.success("밴드가 삭제되었습니다.");
    router.push("/band");
  };

  const handleLeave = async () => {
    if (isSubmitting) return;
    if (!confirm("밴드를 탈퇴하시겠습니까?")) return;
    setIsSubmitting(true);
    const result = await leaveBand(bandId);
    if (isError(result)) {
      toast.error(result.error.message);
      setIsSubmitting(false);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-bands"] });
    queryClient.invalidateQueries({ queryKey: ["all-bands"] });
    toast.success("밴드에서 탈퇴했습니다.");
    router.push("/band");
  };

  if (isLoading) {
    return (
      <div className="grow flex justify-center items-center">
        <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>loading...</p>
      </div>
    );
  }

  if (!band) return null;

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={() => router.back()}
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            background: "#242426",
            border: "1px solid #323234",
            color: "#E5E5E9",
            fontSize: "1.25rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          type="button"
          aria-label="뒤로가기"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.band.hover;
            e.currentTarget.style.borderColor = COLORS.band.border;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#242426";
            e.currentTarget.style.borderColor = "#323234";
          }}
        >
          ←
        </button>
        <p
          className="flex-1 text-center"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.25rem",
            color: COLORS.band.primary,
            margin: "0 16px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {band.name}
        </p>
        {isLeader ? (
          <button
            onClick={() => router.push(`/band/${bandId}/edit`)}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "#242426",
              border: "1px solid #323234",
              color: "#9F9FA2",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            type="button"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.band.hover;
              e.currentTarget.style.borderColor = COLORS.band.border;
              e.currentTarget.style.color = COLORS.band.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#242426";
              e.currentTarget.style.borderColor = "#323234";
              e.currentTarget.style.color = "#9F9FA2";
            }}
          >
            ✎
          </button>
        ) : (
          <div style={{ width: "36px" }} />
        )}
      </div>

      {/* Header와 Content 사이 구분선 */}
      <div style={{ height: "1px", background: "#323234", margin: "0 20px" }} />

      {/* Hero: 프로필 이미지 + 밴드명 + 메타 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 20px 20px",
          gap: "10px",
        }}
      >
        {/* 아바타 */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#242426",
            border: "2px solid rgba(108, 158, 255, 0.5)",
            boxShadow: "0 0 0 4px rgba(108, 158, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {band.profile_image ? (
            <img
              src={band.profile_image}
              alt={band.name ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "2rem", color: "#535355" }}>♪</span>
          )}
        </div>

        {/* 밴드명 */}
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.3px",
          }}
        >
          {band.name}
        </p>

        {/* 메타: 지역 · 인원 · 실력대 */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {band.location && (
            <span style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
              {band.location}
            </span>
          )}
          {band.location && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#535355" }} />}
          <span style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
            {band.band_member?.length ?? 0}명
          </span>
          {band.level && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#535355" }} />}
          {band.level && (
            <span style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
              {band.level}
            </span>
          )}
        </div>
      </div>

      <div style={{ height: "1px", background: "#323234", margin: "0 20px 24px" }} />

      {/* Band Info */}
      <div className="px-5 pb-4">
        <span style={SECTION_LABEL_STYLE}>Band Info</span>

        {/* 카드 */}
        <div
          style={{
            background: "#242426",
            border: "1px solid #323234",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          {/* 2열 그리드: 지역 + 실력대 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {/* 지역 */}
            {band.location && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={INFO_LABEL_STYLE}>지역</span>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  <LocationTag text={band.location} />
                </div>
              </div>
            )}

            {/* 실력대 */}
            {band.level && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={INFO_LABEL_STYLE}>실력대</span>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  <LevelTag text={band.level} />
                </div>
              </div>
            )}

            {/* 장르 (full width) */}
            {band.genre && band.genre.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  gridColumn: "1 / -1",
                }}
              >
                <span style={INFO_LABEL_STYLE}>장르</span>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {band.genre.map((g, i) => (
                    <GenreTag key={`g-${i}`} text={g} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 설명 */}
          {band.description && (
            <div
              style={{
                fontSize: "0.875rem",
                fontFamily: "SUIT-BODY",
                color: "#c0c0c5",
                lineHeight: "1.6",
                paddingTop: "12px",
                borderTop: "1px solid #323234",
                whiteSpace: "pre-wrap",
              }}
            >
              {band.description}
            </div>
          )}

          {/* 커스텀 태그 */}
          {band.tags && band.tags.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "12px" }}>
              {band.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontFamily: "SUIT-BODY",
                    fontWeight: 500,
                    background: "rgba(108, 158, 255, 0.1)",
                    color: "#6C9EFF",
                    border: "1px solid rgba(108, 158, 255, 0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="px-5 pb-4">
        <span style={SECTION_LABEL_STYLE}>Members</span>
        <p
          className="mb-3"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "0.875rem",
            color: "#E5E5E9",
          }}
        >
          총 {band.band_member?.length ?? 0}명
        </p>
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-2"
        >
          {band.band_member?.map((member) => (
            <motion.div
              key={member.id}
              variants={STAGGER_ITEM}
              className="p-3"
              style={{
                background: "#242426",
                border: "1px solid #323234",
                borderRadius: "8px",
                cursor: member.user?.nickname ? "pointer" : "default",
              }}
              onClick={() => member.user?.nickname && router.push(`/user-profile/${member.user.nickname}`)}
            >
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#323234",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: member.role === "leader" ? "1px solid #6C9EFF" : "1px solid #444447",
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
                        fontSize: "0.875rem",
                        color: "#9F9FA2",
                      }}
                    >
                      {(member.user?.nickname ?? "?")[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                          color: "#6C9EFF",
                          background: "rgba(108, 158, 255, 0.15)",
                          padding: "2px 6px",
                          borderRadius: "2px",
                          fontWeight: 600,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.5px",
                          border: "1px solid rgba(108, 158, 255, 0.3)",
                        }}
                      >
                        Leader
                      </span>
                    )}
                  </div>
                  <PositionTag
                    text={member.pos}
                    style={{
                      fontSize: "0.625rem",
                      padding: "2px 6px",
                      display: "inline-flex",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Action Buttons (멤버/리더만 표시) */}
      {(isLeader || isMember) && (
        <>
          <div style={{ height: "1px", background: "#323234", margin: "0 20px 24px" }} />
          <div className="px-5 pb-6 mt-auto flex flex-col gap-2">
            {isLeader ? (
              <>
                <button
                  onClick={() => router.push(`/recruit/write?band_id=${bandId}`)}
                  style={{
                    ...ACTION_BUTTON_BASE,
                    background: "rgba(163, 255, 12, 0.12)",
                    color: "#A3FF0C",
                    border: "1px solid #A3FF0C",
                  }}
                  type="button"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(163, 255, 12, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(163, 255, 12, 0.12)";
                  }}
                >
                  구인글 작성하기
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  style={{
                    ...ACTION_BUTTON_BASE,
                    background: "rgba(255, 62, 47, 0.15)",
                    color: "#FF3E2F",
                    border: "1px solid rgba(255, 62, 47, 0.3)",
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                  type="button"
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.background = "rgba(255, 62, 47, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 62, 47, 0.15)";
                  }}
                >
                  {isSubmitting ? "삭제 중..." : "밴드 삭제"}
                </button>
              </>
            ) : (
              <button
                onClick={handleLeave}
                disabled={isSubmitting}
                style={{
                  ...ACTION_BUTTON_BASE,
                  background: "rgba(255, 62, 47, 0.15)",
                  color: "#FF3E2F",
                  border: "1px solid rgba(255, 62, 47, 0.3)",
                  opacity: isSubmitting ? 0.5 : 1,
                }}
                type="button"
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = "rgba(255, 62, 47, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 62, 47, 0.15)";
                }}
              >
                {isSubmitting ? "탈퇴 중..." : "밴드 탈퇴"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
