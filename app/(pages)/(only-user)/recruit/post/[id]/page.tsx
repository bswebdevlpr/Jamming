"use client";

import { useEffect, useState } from "react";
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
import { Entity_RecruitPost } from "@/app/lib/interfaces/entity.interface";
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

export default function RecruitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);
  const { userProfile } = useSessionStore();

  const [post, setPost] = useState<Entity_RecruitPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Comment form
  const [commentBody, setCommentBody] = useState("");
  const [appliedPos, setAppliedPos] = useState<PositionEnum>(PositionEnum.Guitar);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = post?.user_id === userProfile.id;
  const isBandLeader =
    post?.band?.band_member?.some(
      (m: any) => m.role === "leader" && m.user?.nickname === userProfile.nickname
    ) ?? isAuthor;

  const hasApplied = post?.recruit_comment?.some(
    (c) => c.user_id === userProfile.id
  );

  const loadPost = async () => {
    try {
      const data = await getRecruitPost(postId);
      setPost(data);
    } catch {
      router.push("/recruit");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPost();
  }, [postId]);

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
    if (isSubmitting || !commentBody.trim()) return;
    setIsSubmitting(true);
    const result = await createRecruitComment({
      recruit_id: postId,
      user_id: userProfile.id!,
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

  const handleAccept = async (commentId: number) => {
    const result = await updateRecruitComment(commentId, true);
    if (result.success) loadPost();
    else if (result.success === false) alert(result.error.message);
  };

  const handleReject = async (commentId: number) => {
    const result = await updateRecruitComment(commentId, false);
    if (result.success) loadPost();
    else if (result.success === false) alert(result.error.message);
  };

  const handleDeleteComment = async (commentId: number) => {
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

  const positions = (post.positions ?? []) as {
    pos: string;
    headcnt: number;
  }[];

  const tags = [
    ...(post.location ? [<LocationTag key="loc" text={post.location} />] : []),
    ...(positions.map((p, i) => <PositionTag key={`p-${i}`} text={p.pos} />)),
    ...(post.genre
      ? post.genre.map((g, i) => <GenreTag key={`g-${i}`} text={g} />)
      : []),
    ...(post.level
      ? post.level.map((l, i) => <LevelTag key={`l-${i}`} text={l} />)
      : []),
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
        {/* Title */}
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

        {/* Band info */}
        <div className="flex items-center gap-2 mb-3">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#A3FF0C",
            }}
          >
            {post.band?.name}
          </p>
          <span style={{ color: "#535355", fontSize: "0.75rem" }}>|</span>
          <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
            조회 {post.view_count}
          </p>
          <span style={{ color: "#535355", fontSize: "0.75rem" }}>|</span>
          <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#9F9FA2" }}>
            {moment(post.created_at).fromNow()}
          </p>
        </div>

        <TagList tags={tags} />

        {/* Positions needed */}
        <div className="mt-4 mb-3">
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#E5E5E9",
              marginBottom: "8px",
            }}
          >
            모집 포지션
          </p>
          <div className="flex flex-col gap-1">
            {positions.map((p, i) => {
              const applied = post.appliedPosDict?.[p.pos] ?? 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <PositionTag text={p.pos} />
                  <p
                    style={{
                      fontFamily: "SUIT-BODY",
                      fontSize: "0.75rem",
                      color: "#9F9FA2",
                    }}
                  >
                    <span style={{ color: "#A3FF0C" }}>{applied}</span>/{p.headcnt}명
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadline */}
        {post.deadline && (
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
              marginBottom: "8px",
            }}
          >
            마감일: {moment(post.deadline).format("YYYY.MM.DD")}
          </p>
        )}

        {/* Body */}
        <div
          className="mt-3 mb-4"
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

        {/* Video */}
        {post.video_url && (
          <div className="mb-4">
            <a
              href={post.video_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#3994FF",
                textDecoration: "underline",
              }}
            >
              영상 보기
            </a>
          </div>
        )}

        {/* Openchat */}
        {post.openchat && (
          <div className="mb-4">
            <a
              href={post.openchat}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#3994FF",
                textDecoration: "underline",
              }}
            >
              오픈채팅 참여
            </a>
          </div>
        )}

        {/* Songs */}
        {post.songs && post.songs.length > 0 && (
          <div className="mb-4">
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#E5E5E9",
                marginBottom: "8px",
              }}
            >
              합주곡
            </p>
            {post.songs.map((song, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.75rem", color: "#c0c0c5" }}>
                  {song.title} - {song.artist}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons for author */}
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

        {/* Comments (Applications) */}
        <div className="mt-4">
          <p
            style={{
              fontFamily: "SBAggroB",
              fontSize: "0.875rem",
              color: "#A3FF0C",
              marginBottom: "12px",
            }}
          >
            Applications ({post.recruit_comment?.length ?? 0})
          </p>

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
                className="py-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
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
                  <p
                    style={{
                      fontFamily: "SUIT-BODY",
                      fontSize: "0.625rem",
                      color: "#535355",
                    }}
                  >
                    {moment(comment.created_at).fromNow()}
                  </p>
                </div>
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
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Apply form */}
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
                value={appliedPos}
                onChange={(e) => setAppliedPos(e.target.value as PositionEnum)}
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
