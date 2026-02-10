"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";

export async function deleteBand(
  bandId: number
): Promise<ActionResult<boolean>> {
  return safeAction("deleteBand", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드장 권한 확인
    const { data: band, error: bandErr } = await supabase
      .from("band")
      .select("id, leader_id, profile_image")
      .eq("id", bandId)
      .single();

    if (bandErr || !band) {
      throw CustomError.invalidBand({ operation: "deleteBand" });
    }
    if (band.leader_id !== user.id) {
      throw CustomError.notBandLeader({ operation: "deleteBand" });
    }

    // 관련 구인글 이미지 조회 후 Storage 삭제
    const { data: recruitPosts } = await supabase
      .from("recruit_post")
      .select("images")
      .eq("band_id", bandId);

    const imagesToDelete: string[] = [];
    if (band.profile_image) imagesToDelete.push(band.profile_image);
    if (recruitPosts) {
      for (const post of recruitPosts) {
        if (post.images?.length > 0) {
          imagesToDelete.push(...post.images);
        }
      }
    }

    if (imagesToDelete.length > 0) {
      await supabase.storage
        .from(process.env.SUPABASE_STORAGE_NAME!)
        .remove(imagesToDelete);
    }

    // CASCADE로 band_member, recruit_post, recruit_comment 자동 삭제
    const { error } = await supabase
      .from("band")
      .delete()
      .eq("id", bandId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "deleteBand"
      );
    }

    return true;
  });
}
