"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateRecruitCommentDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";
import { createNotification } from "../notification";

export async function createRecruitComment(
  input: CreateRecruitCommentDto
): Promise<ActionResult<boolean>> {
  return safeAction("createRecruitComment", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 게시글 활성 여부 확인
    const { data: post, error: postErr } = await supabase
      .from("recruit_post")
      .select("id, is_active, deadline, positions, band_id, title")
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

    // 게시글에 존재하는 포지션인지 검증
    const validPositions = (post.positions ?? []).map(
      (p: { pos: string }) => p.pos
    );
    if (!validPositions.includes(input.applied_pos)) {
      throw CustomError.invalidRecruit({
        operation: "createRecruitComment: invalid applied_pos",
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

    // 밴드장에게 지원 알림 전송
    if (post.band_id) {
      const [{ data: band }, { data: applicant }] = await Promise.all([
        supabase.from("band").select("leader_id, name").eq("id", post.band_id).maybeSingle(),
        supabase.from("user").select("nickname").eq("id", user.id).maybeSingle(),
      ]);

      if (band?.leader_id && band.leader_id !== user.id) {
        await createNotification(
          band.leader_id,
          "recruit_apply",
          "구인글에 새 지원이 도착했어요",
          `${applicant?.nickname ?? "누군가"}님이 '${post.title ?? "구인글"}'에 지원했어요.`,
          { recruit_id: input.recruit_id }
        );
      }
    }

    return true;
  });
}

export async function updateRecruitComment(
  commentId: string,
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
      .select("id, leader_id, name")
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

    // 수락 시: 알림 전송 + 밴드 멤버 자동 추가
    if (isAccepted) {
      await createNotification(
        comment.user_id,
        "recruit_accept",
        "구인 지원이 수락됐어요",
        `'${band.name ?? "밴드"}' 밴드에 합류하게 됐어요!`,
        { recruit_id: comment.recruit_id, band_id: band.id }
      );

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
  commentId: string
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
