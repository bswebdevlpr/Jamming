"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateRecruitPostDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function updateRecruitPost(
  postId: string,
  input: Partial<CreateRecruitPostDto>
): Promise<ActionResult<boolean>> {
  return safeAction("updateRecruitPost", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 작성자 확인
    const { data: post, error: postErr } = await supabase
      .from("recruit_post")
      .select("id, user_id")
      .eq("id", postId)
      .single();

    if (postErr || !post) {
      throw CustomError.invalidRecruit({ operation: "updateRecruitPost" });
    }
    if (post.user_id !== user.id) {
      throw CustomError.forbidden({ operation: "updateRecruitPost" });
    }

    // XSS 방지
    if (input.body) {
      input.body = await sanitize(input.body);
    }

    const payload: Record<string, unknown> = {};
    if (input.title !== undefined) payload.title = input.title;
    if (input.body !== undefined) payload.body = input.body;
    if (input.positions !== undefined) payload.positions = input.positions;
    if (input.genre !== undefined) payload.genre = input.genre;
    if (input.level !== undefined) payload.level = input.level;
    if (input.location !== undefined) payload.location = input.location;
    if (input.songs !== undefined) payload.songs = input.songs;
    if (input.images !== undefined) payload.images = input.images;
    if (input.video_url !== undefined) payload.video_url = input.video_url || null;
    if (input.openchat !== undefined) payload.openchat = input.openchat || null;
    if (input.deadline !== undefined) payload.deadline = input.deadline || null;

    const { error } = await supabase
      .from("recruit_post")
      .update(payload)
      .eq("id", postId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "updateRecruitPost"
      );
    }

    return true;
  });
}

export async function closeRecruitPost(
  postId: string
): Promise<ActionResult<boolean>> {
  return safeAction("closeRecruitPost", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 작성자 확인 (밴드장)
    const { data: post, error: postErr } = await supabase
      .from("recruit_post")
      .select("id, user_id, band_id")
      .eq("id", postId)
      .single();

    if (postErr || !post) {
      throw CustomError.invalidRecruit({ operation: "closeRecruitPost" });
    }

    const { data: band } = await supabase
      .from("band")
      .select("leader_id")
      .eq("id", post.band_id)
      .single();

    if (band?.leader_id !== user.id) {
      throw CustomError.notBandLeader({ operation: "closeRecruitPost" });
    }

    const { error } = await supabase
      .from("recruit_post")
      .update({ is_active: false })
      .eq("id", postId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "closeRecruitPost"
      );
    }

    return true;
  });
}
