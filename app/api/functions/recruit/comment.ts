"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateRecruitCommentDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function createRecruitComment(
  input: CreateRecruitCommentDto
): Promise<ActionResult<boolean>> {
  return safeAction("createRecruitComment", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 게시글 활성 여부 확인
    const { data: post, error: postErr } = await supabase
      .from("recruit_post")
      .select("id, is_active, deadline")
      .eq("id", input.recruit_id)
      .single();

    if (postErr || !post) {
      throw CustomError.invalidRecruit({
        operation: "createRecruitComment",
      });
    }

    // deadline 자동 마감 체크
    if (post.deadline) {
      const deadline = new Date(post.deadline);
      if (deadline < new Date()) {
        throw CustomError.recruitNotActive({
          operation: "createRecruitComment: deadline passed",
        });
      }
    }

    if (!post.is_active) {
      throw CustomError.recruitNotActive({
        operation: "createRecruitComment",
      });
    }

    // 중복 지원 확인
    const { data: existing } = await supabase
      .from("recruit_comment")
      .select("id")
      .eq("recruit_id", input.recruit_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      throw CustomError.alreadyApplied({
        operation: "createRecruitComment",
      });
    }

    // XSS 방지
    input.body = await sanitize(input.body);

    // 지원 댓글 생성
    const { error } = await supabase.from("recruit_comment").insert({
      recruit_id: input.recruit_id,
      user_id: user.id,
      body: input.body,
      applied_pos: input.applied_pos,
    });

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "createRecruitComment.insert"
      );
    }

    return true;
  });
}

export async function updateRecruitComment(
  commentId: number,
  isAccepted: boolean
): Promise<ActionResult<boolean>> {
  return safeAction("updateRecruitComment", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 댓글 정보 조회
    const { data: comment, error: commentErr } = await supabase
      .from("recruit_comment")
      .select("id, recruit_id, user_id, applied_pos")
      .eq("id", commentId)
      .single();

    if (commentErr || !comment) {
      throw CustomError.invalidRecruit({
        operation: "updateRecruitComment",
      });
    }

    // 밴드장 권한 확인
    const { data: post } = await supabase
      .from("recruit_post")
      .select("band_id")
      .eq("id", comment.recruit_id)
      .single();

    if (!post) {
      throw CustomError.invalidRecruit({
        operation: "updateRecruitComment.getPost",
      });
    }

    const { data: band } = await supabase
      .from("band")
      .select("id, leader_id")
      .eq("id", post.band_id)
      .single();

    if (!band || band.leader_id !== user.id) {
      throw CustomError.notBandLeader({
        operation: "updateRecruitComment",
      });
    }

    // is_accepted 업데이트
    const { error } = await supabase
      .from("recruit_comment")
      .update({ is_accepted: isAccepted })
      .eq("id", commentId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "updateRecruitComment.update"
      );
    }

    // 수락 시 밴드 멤버 자동 추가
    if (isAccepted) {
      // 멤버 수 제한 체크
      const { count: memberCount } = await supabase
        .from("band_member")
        .select("id", { count: "exact", head: true })
        .eq("band_id", band.id);

      if ((memberCount ?? 0) < 10) {
        // 이미 멤버인지 확인
        const { data: existingMember } = await supabase
          .from("band_member")
          .select("id")
          .eq("band_id", band.id)
          .eq("user_id", comment.user_id)
          .maybeSingle();

        if (!existingMember) {
          await supabase.from("band_member").insert({
            band_id: band.id,
            user_id: comment.user_id,
            pos: comment.applied_pos,
            role: "member",
            is_public: true,
          });
        }
      }
    }

    return true;
  });
}

export async function deleteRecruitComment(
  commentId: number
): Promise<ActionResult<boolean>> {
  return safeAction("deleteRecruitComment", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 작성자 확인
    const { data: comment, error: commentErr } = await supabase
      .from("recruit_comment")
      .select("id, user_id")
      .eq("id", commentId)
      .single();

    if (commentErr || !comment) {
      throw CustomError.invalidRecruit({
        operation: "deleteRecruitComment",
      });
    }
    if (comment.user_id !== user.id) {
      throw CustomError.forbidden({ operation: "deleteRecruitComment" });
    }

    const { error } = await supabase
      .from("recruit_comment")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "deleteRecruitComment"
      );
    }

    return true;
  });
}
