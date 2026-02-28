"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getRecruitPost } from "@/app/api/functions/recruit/read";
import { closeRecruitPost } from "@/app/api/functions/recruit/update";
import { deleteRecruitPost } from "@/app/api/functions/recruit/delete";
import {
  createRecruitComment,
  updateRecruitComment,
  deleteRecruitComment,
} from "@/app/api/functions/recruit/comment";
import { Entity_RecruitPost, Entity_BandMember, Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { useSessionStore } from "@/app/stores";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { STAGGER_CONTAINER, STAGGER_ITEM } from "@/app/lib/animations";
import moment from "moment";

// 포지션 아이콘 매핑
const POSITION_ICONS: Record<string, string> = {
  "기타": "🎸",
  "드럼": "🥁",
  "보컬": "🎤",
  "베이스": "🎸",
  "키보드": "🎹",
};

// 색상 상수
const COLORS = {
  band: {
    primary: "#6C9EFF",
    background: "rgba(100, 150, 255, 0.15)",
    border: "rgba(108, 158, 255, 0.3)",
    hover: "rgba(108, 158, 255, 0.05)",
  },
  recruit: {
    primary: "#A3FF0C",
    background: "rgba(163, 255, 12, 0.15)",
    border: "rgba(163, 255, 12, 0.3)",
  },
} as const;

// 섹션 라벨 스타일
const SECTION_LABEL_BASE = {
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
};

const BAND_LABEL_STYLE = {
  ...SECTION_LABEL_BASE,
  background: COLORS.band.background,
  color: COLORS.band.primary,
  border: `1px solid ${COLORS.band.border}`,
};

const RECRUIT_LABEL_STYLE = {
  ...SECTION_LABEL_BASE,
  background: COLORS.recruit.background,
  color: COLORS.recruit.primary,
  border: `1px solid ${COLORS.recruit.border}`,
};

// 타입 정의
type Position = { pos: string; headcnt: number };

export default function RecruitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { userProfile } = useSessionStore();
  const queryClient = useQueryClient();

  const [post, setPost] = useState<Entity_RecruitPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Comment form
  const [commentBody, setCommentBody] = useState("");
  const [appliedPos, setAppliedPos] = useState<PositionEnum | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = post?.user_id === userProfile.id;
  const isBandLeader =
    isAuthor ||
    (post?.band?.band_member?.some(
      (m: Entity_BandMember) => m.role === "leader" && m.user_id === userProfile.id
    ) ?? false);

  const hasApplied = post?.recruit_comment?.some(
    (c) => c.user_id === userProfile.id
  );

  const loadPost = useCallback(async () => {
    let isMounted = true;
    try {
      const data = await getRecruitPost(postId);
      if (isMounted) {
        setPost(data);
      }
    } catch (error) {
      console.error("Failed to load recruit post:", error);
      if (isMounted) {
        router.push("/recruit");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [postId, router]);

  useEffect(() => {
    const cleanup = loadPost();
    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, [loadPost]);

  // post 로드 후 첫 번째 포지션으로 초기화 (하드코딩 방지)
  useEffect(() => {
    if (post?.positions && Array.isArray(post.positions) && post.positions.length > 0) {
      const firstPos = post.positions[0].pos;
      setAppliedPos(firstPos as PositionEnum);
    }
  }, [post]);

  const handleClose = async () => {
    if (!confirm("구인글을 마감하시겠습니까?")) return;
    const result = await closeRecruitPost(postId);
    if (result.success) loadPost();
    else if (result.success === false) alert(result.error.message);
  };

  const handleDelete = async () => {
    if (!confirm("구인글을 삭제하시겠습니까?")) return;
    const result = await deleteRecruitPost(postId);
    if (result.success) router.push("/recruit");
    else if (result.success === false) alert(result.error.message);
  };

  const handleApply = async () => {
    if (!userProfile.id) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (isSubmitting || !commentBody.trim() || !appliedPos) return;
    setIsSubmitting(true);
    const result = await createRecruitComment({
      recruit_id: postId,
      user_id: userProfile.id,
      body: commentBody,
      applied_pos: appliedPos,
    });
    if (result.success) {
      setCommentBody("");
      loadPost();
    } else if (result.success === false) {
      alert(result.error.message);
    }
    setIsSubmitting(false);
  };

  const handleAccept = async (commentId: string) => {
    const result = await updateRecruitComment(commentId, true);
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["recruit-posts"] });
      loadPost();
    } else if (result.success === false) alert(result.error.message);
  };

  const handleReject = async (commentId: string) => {
    const result = await updateRecruitComment(commentId, false);
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["recruit-posts"] });
      loadPost();
    } else if (result.success === false) alert(result.error.message);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("지원을 취소하시겠습니까?")) return;
    const result = await deleteRecruitComment(commentId);
    if (result.success) loadPost();
    else if (result.success === false) alert(result.error.message);
  };

  if (isLoading) {
    return (
      <div className="grow flex justify-center items-center">
        <p style={{ color: "#9F9FA2", fontFamily: "SUIT-BODY" }}>loading...</p>
      </div>
    );
  }

  if (!post) return null;

  // 타입 가드로 positions 검증
  const isPositionArray = (val: unknown): val is Position[] => {
    return (
      Array.isArray(val) &&
      val.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.pos === "string" &&
          typeof item.headcnt === "number"
      )
    );
  };

  const positions: Position[] = isPositionArray(post.positions)
    ? post.positions
    : [];

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
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          구인 상세
        </p>
        <div style={{ width: "40px" }}>
          {isAuthor && (
            <button
              onClick={() => router.push(`/recruit/post/${postId}/edit`)}
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

      {/* Content */}
      <div className="px-5 pb-4 overflow-without-scroll flex-1">
        {/* ===== SECTION 1: Title & Meta ===== */}
        <div className="mb-4">
          <h1
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1.25rem",
              color: "#ededed",
              marginBottom: "8px",
            }}
          >
            {post.title}
            {!post.is_active && (
              <span
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.75rem",
                  color: "#FF3E2F",
                  marginLeft: "8px",
                }}
              >
                [마감]
              </span>
            )}
          </h1>

          {/* 조회수, 작성시간 */}
          <div className="flex items-center gap-2">
            <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
              조회 {post.view_count}
            </p>
            <span style={{ color: "#535355", fontSize: "0.75rem" }}>|</span>
            <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
              {moment(post.created_at).fromNow()}
            </p>
          </div>
        </div>

        {/* ===== SECTION 2: Band Info Card ===== */}
        {post.band && (
          <div className="mb-4">
            <span style={BAND_LABEL_STYLE}>
              🎵 Band Information
            </span>
            <BandInfoCard
              band={post.band}
              onClick={() => {
                if (!post.band?.id) {
                  console.warn("Band ID is missing");
                  return;
                }
                router.push(`/band/${post.band.id}`);
              }}
            />
          </div>
        )}

        {/* ===== SECTION 3: 핵심 정보 카드 (모집 포지션 + 마감일) ===== */}
        <div className="mb-4">
          <span style={RECRUIT_LABEL_STYLE}>
            📢 Recruitment Details
          </span>
          <motion.div
            style={{
              background: "#242426",
              border: "1px solid #535355",
              borderLeft: "3px solid #A3FF0C",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 헤더 */}
            <div
              className="flex items-center justify-between mb-4 pb-3"
              style={{ borderBottom: "1px solid #323234" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "1.25rem" }}>🎯</span>
                <p
                  style={{
                    fontFamily: "SBAggroB",
                    fontSize: "0.875rem",
                    color: "#A3FF0C",
                  }}
                >
                  모집 중
                </p>
              </div>
              <span
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.625rem",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background: post.is_active
                    ? "rgba(163, 255, 12, 0.15)"
                    : "rgba(255, 62, 47, 0.15)",
                  color: post.is_active ? "#A3FF0C" : "#FF3E2F",
                  border: post.is_active
                    ? "1px solid rgba(163, 255, 12, 0.3)"
                    : "1px solid rgba(255, 62, 47, 0.3)",
                }}
              >
                {post.is_active ? "모집중" : "마감"}
              </span>
            </div>

            {/* 모집 포지션 목록 */}
            <div className="flex flex-col gap-3">
              {positions.map((p) => {
                const applied = post.appliedPosDict?.[p.pos] ?? 0;
                const isFilled = applied >= p.headcnt;
                return (
                  <div
                    key={p.pos}
                    className="flex items-center justify-between"
                    style={{
                      padding: "12px",
                      background: COLORS.recruit.background,
                      border: `1px solid ${COLORS.recruit.border}`,
                      borderRadius: "6px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "1.25rem" }}>
                        {POSITION_ICONS[p.pos] ?? "🎵"}
                      </span>
                      <span
                        style={{
                          fontFamily: "SUIT-TITLE",
                          fontSize: "0.875rem",
                          color: "#E5E5E9",
                        }}
                      >
                        {p.pos}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        style={{
                          fontFamily: "SUIT-TITLE",
                          fontSize: "1rem",
                          color: isFilled ? "#FFD700" : "#A3FF0C",
                        }}
                      >
                        {applied}
                      </p>
                      <p
                        style={{
                          fontFamily: "SUIT-BODY",
                          fontSize: "0.875rem",
                          color: "#535355",
                        }}
                      >
                        / {p.headcnt}명
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 마감일 */}
            {post.deadline && (
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #323234",
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "1rem" }}>📅</span>
                  <p
                    style={{
                      fontFamily: "SUIT-BODY",
                      fontSize: "0.75rem",
                      color: "#9F9FA2",
                    }}
                  >
                    마감일
                  </p>
                  <p
                    style={{
                      fontFamily: "SUIT-TITLE",
                      fontSize: "0.875rem",
                      color: "#E5E5E9",
                    }}
                  >
                    {moment(post.deadline).format("YYYY.MM.DD")}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ===== SECTION 4: 본문 ===== */}
        <div className="mb-4">
          <span style={RECRUIT_LABEL_STYLE}>
            📝 Description
          </span>
          <div
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#c0c0c5",
              lineHeight: "160%",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.body}
          </div>
        </div>

        {/* ===== SECTION 5: 합주곡 ===== */}
        {post.songs && post.songs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                style={{
                  width: "3px",
                  height: "14px",
                  background: "#A3FF0C",
                  borderRadius: "2px",
                }}
              />
              <p
                style={{
                  fontFamily: "SUIT-TITLE",
                  fontSize: "0.875rem",
                  color: "#E5E5E9",
                }}
              >
                합주곡
              </p>
            </div>
            <div className="flex flex-col gap-1">
              {post.songs.map((song) => (
                <p
                  key={`${song.title}-${song.artist}`}
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "0.875rem",
                    color: "#c0c0c5",
                    paddingLeft: "14px",
                  }}
                >
                  {song.title} - {song.artist}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ===== SECTION 6: 링크 그룹 (영상, 오픈채팅) ===== */}
        {(post.video_url || post.openchat) && (
          <div className="flex flex-col gap-2 mb-4">
            {post.video_url && (
              <a
                href={post.video_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(57, 148, 255, 0.12)",
                  border: "1px solid #3994FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  color: "#3994FF",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <span>📹 영상 보기</span>
                <span>&gt;</span>
              </a>
            )}
            {post.openchat && (
              <a
                href={post.openchat}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(163, 255, 12, 0.12)",
                  border: "1px solid #A3FF0C",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  color: "#A3FF0C",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <span>💬 오픈채팅 참여</span>
                <span>&gt;</span>
              </a>
            )}
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "#323234",
            margin: "24px 0",
          }}
        />

        {/* ===== SECTION 7: Action buttons for author ===== */}
        {isAuthor && post.is_active && (
          <div className="flex gap-2 mb-4">
            <ButtonTemplate text="마감하기" onClick={handleClose} type="button" />
            <button
              onClick={handleDelete}
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#FF3E2F",
                background: "none",
                border: "1px solid #FF3E2F",
                borderRadius: "8px",
                padding: "10px 12px",
                cursor: "pointer",
                width: "100%",
              }}
              type="button"
            >
              삭제
            </button>
          </div>
        )}

        {/* ===== SECTION 8: Comments (Applications) ===== */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              style={{
                width: "3px",
                height: "14px",
                background: "#A3FF0C",
                borderRadius: "2px",
              }}
            />
            <p
              style={{
                fontFamily: "SBAggroB",
                fontSize: "0.875rem",
                color: "#A3FF0C",
              }}
            >
              Applications ({post.recruit_comment?.length ?? 0})
            </p>
          </div>

          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2"
          >
            {post.recruit_comment?.map((comment) => (
              <motion.div
                key={comment.id}
                variants={STAGGER_ITEM}
                className="p-3"
                style={{
                  background: "#242426",
                  border: "1px solid #323234",
                  borderRadius: "8px",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* 프로필 이미지 */}
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
                      flexShrink: 0,
                    }}
                  >
                    {comment.user?.profile_image ? (
                      <img
                        src={comment.user.profile_image}
                        alt={comment.user.nickname ?? ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "SUIT-BODY",
                          fontSize: "0.75rem",
                          color: "#9F9FA2",
                        }}
                      >
                        {(comment.user?.nickname ?? "?")[0]}
                      </span>
                    )}
                  </div>

                  {/* 정보 영역 */}
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    {/* 닉네임 + 태그 + 배지 */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p
                        style={{
                          fontFamily: "SUIT-BODY",
                          fontSize: "0.875rem",
                          color: "#ededed",
                        }}
                      >
                        {comment.user?.nickname ?? "알 수 없음"}
                      </p>
                      <PositionTag text={comment.applied_pos} />
                      {comment.is_accepted === true && (
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
                          수락됨
                        </span>
                      )}
                      {comment.is_accepted === false && (
                        <span
                          style={{
                            fontFamily: "SUIT-BODY",
                            fontSize: "0.625rem",
                            color: "#FF3E2F",
                            background: "rgba(255, 62, 47, 0.2)",
                            padding: "1px 6px",
                            borderRadius: "2px",
                          }}
                        >
                          거절됨
                        </span>
                      )}
                    </div>

                    {/* 시간 */}
                    <p
                      style={{
                        fontFamily: "SUIT-BODY",
                        fontSize: "0.625rem",
                        color: "#535355",
                        marginBottom: "8px",
                      }}
                    >
                      {moment(comment.created_at).fromNow()}
                    </p>

                    {/* 본문 */}
                    <p
                      style={{
                        fontFamily: "SUIT-BODY",
                        fontSize: "0.875rem",
                        color: "#c0c0c5",
                        lineHeight: "150%",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {comment.body}
                    </p>

                    {/* Leader actions */}
                    {isBandLeader && comment.is_accepted === null && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAccept(comment.id)}
                          style={{
                            fontFamily: "SUIT-BODY",
                            fontSize: "0.75rem",
                            color: "#A3FF0C",
                            background: "rgba(163, 255, 12, 0.16)",
                            border: "1px solid #A3FF0C",
                            borderRadius: "4px",
                            padding: "4px 12px",
                            cursor: "pointer",
                          }}
                          type="button"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => handleReject(comment.id)}
                          style={{
                            fontFamily: "SUIT-BODY",
                            fontSize: "0.75rem",
                            color: "#FF3E2F",
                            background: "rgba(255, 62, 47, 0.1)",
                            border: "1px solid #FF3E2F",
                            borderRadius: "4px",
                            padding: "4px 12px",
                            cursor: "pointer",
                          }}
                          type="button"
                        >
                          거절
                        </button>
                      </div>
                    )}

                    {/* Own comment: delete */}
                    {comment.user_id === userProfile.id &&
                      comment.is_accepted === null && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            fontFamily: "SUIT-BODY",
                            fontSize: "0.75rem",
                            color: "#FF3E2F",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "4px",
                            padding: "2px 0",
                          }}
                          type="button"
                        >
                          지원 취소
                        </button>
                      )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ===== SECTION 9: Apply form ===== */}
        {post.is_active && !isAuthor && !hasApplied && (
          <div
            className="mt-4 p-4"
            style={{
              background: "#242426",
              borderRadius: "8px",
              border: "1px solid #323234",
            }}
          >
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#E5E5E9",
                marginBottom: "12px",
              }}
            >
              지원하기
            </p>
            <div className="flex flex-col gap-3">
              <select
                value={appliedPos ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // PositionEnum 타입 가드
                  if (Object.values(PositionEnum).includes(value as PositionEnum)) {
                    setAppliedPos(value as PositionEnum);
                  }
                }}
                style={{
                  background: "#323234",
                  border: "1px solid #444447",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  color: "#ededed",
                  fontFamily: "SUIT-BODY",
                  fontSize: "16px",
                }}
                aria-label="지원 포지션 선택"
              >
                {positions.map((p) => (
                  <option key={p.pos} value={p.pos}>
                    {p.pos}
                  </option>
                ))}
              </select>
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="자기소개를 작성해주세요 (최대 300자)"
                maxLength={300}
                rows={3}
                style={{
                  background: "#323234",
                  border: "1px solid #444447",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#ededed",
                  fontFamily: "SUIT-BODY",
                  fontSize: "16px",
                  resize: "none",
                }}
              />
              <ButtonTemplate
                text={isSubmitting ? "지원 중..." : "지원하기"}
                isActive={commentBody.trim().length > 0 && !isSubmitting}
                onClick={handleApply}
                type="button"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 밴드 정보 카드 컴포넌트
function BandInfoCard({
  band,
  onClick,
}: {
  band: Entity_Band;
  onClick: () => void;
}) {
  const bandTags = [
    ...(band.location ? [<LocationTag key="b-loc" text={band.location} />] : []),
    ...(band.genre?.map((g, i) => <GenreTag key={`b-g-${i}`} text={g} />) ?? []),
    ...(band.level ? [<LevelTag key="b-lvl" text={band.level} />] : []),
  ];

  return (
    <motion.div
      className="p-4"
      style={{
        background: "#242426",
        border: "1px solid #323234",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={onClick}
      whileHover={{ background: COLORS.band.hover }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#323234",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            flexShrink: 0,
            border: `2px solid ${COLORS.band.primary}`,
          }}
        >
          {band.profile_image ? (
            <img
              src={band.profile_image}
              alt={band.name ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "1.25rem",
              }}
            >
              {(band.name ?? "?")[0]}
            </span>
          )}
        </div>

        <div className="flex-1" style={{ minWidth: 0 }}>
          {/* 밴드명 */}
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1rem",
              color: COLORS.band.primary,
              marginBottom: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {band.name}
          </p>
          {/* 메타 정보 (멤버 수 • 지역) */}
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
              marginBottom: "6px",
            }}
          >
            멤버 {band.band_member?.length ?? 0}명
            {band.location && ` • ${band.location}`}
          </p>
          {/* 밴드 태그 */}
          <TagList tags={bandTags} />
        </div>

        {/* 바로가기 화살표 */}
        <span
          style={{
            color: "#535355",
            fontSize: "1.25rem",
            flexShrink: 0,
          }}
        >
          &gt;
        </span>
      </div>

      {/* 밴드 소개 (2줄 제한) */}
      {band.description && (
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
            lineHeight: "150%",
            marginTop: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {band.description}
        </p>
      )}
    </motion.div>
  );
}
