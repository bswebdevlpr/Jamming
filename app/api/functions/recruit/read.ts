"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_RecruitPost } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";

const RECRUIT_DETAIL_SELECT = `
  *,
  band (
    id, name, description, genre, location, level, profile_image, tags,
    band_member (
      id, user_id, pos, role,
      user ( nickname, profile_image, pos, genre, level )
    )
  ),
  user ( nickname, profile_image ),
  recruit_comment (
    id, user_id, body, applied_pos, is_accepted, created_at,
    user ( nickname, profile_image, pos, genre, level, bpm )
  )
`;

function processRecruitData(data: any): Entity_RecruitPost {
  data.commentCount = data.recruit_comment?.length ?? 0;
  // 수락된 지원자만 집계 (is_accepted === true) → 충원된 슬롯 수 표시
  data.appliedPosDict = (data.recruit_comment ?? [])
    .filter((cur: { is_accepted: boolean | null }) => cur.is_accepted === true)
    .reduce(
      (acc: Record<string, number>, cur: { applied_pos: string }) => {
        const pos = cur.applied_pos;
        if (typeof acc[pos] === "number") acc[pos]++;
        else acc[pos] = 1;
        return acc;
      },
      (data.positions ?? []).reduce(
        (acc: Record<string, number>, cur: { pos: string; headcnt: number }) => {
          if (cur.headcnt > 0) acc[cur.pos] = 0;
          return acc;
        },
        {} as Record<string, number>
      )
    );

  // deadline 자동 마감 체크
  if (data.is_active && data.deadline) {
    const now = new Date();
    const deadline = new Date(data.deadline);
    if (deadline < now) {
      data.is_active = false;
    }
  }

  return data;
}

export async function getRecruitPost(
  id: string
): Promise<Entity_RecruitPost> {
  const supabase = await createClient();
  const user = await getUser(supabase);

  const { data, error } = await supabase
    .from("recruit_post")
    .select(RECRUIT_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      error,
      "getRecruitPost"
    );
  }
  if (!data) {
    throw CustomError.invalidRecruit({ operation: "getRecruitPost" });
  }

  // 조회수 중복 방지: 동일 유저 첫 방문 시에만 증가
  const { data: existingView, error: viewError } = await supabase
    .from("recruit_view")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("recruit_id", id)
    .maybeSingle();

  if (!viewError && !existingView) {
    const { error: insertError } = await supabase
      .from("recruit_view")
      .insert({ user_id: user.id, recruit_id: id });

    if (!insertError) {
      await supabase
        .from("recruit_post")
        .update({ view_count: (data.view_count ?? 0) + 1 })
        .eq("id", id);
    }
  }

  return processRecruitData(data);
}
