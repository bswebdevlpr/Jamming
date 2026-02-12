"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";

export async function deleteRecruitPost(
  postId: string
): Promise<ActionResult<boolean>> {
  return safeAction("deleteRecruitPost", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 작성자 확인
    const { data: post, error: postErr } = await supabase
      .from("recruit_post")
      .select("id, user_id, images")
      .eq("id", postId)
      .single();

    if (postErr || !post) {
      throw CustomError.invalidRecruit({ operation: "deleteRecruitPost" });
    }
    if (post.user_id !== user.id) {
      throw CustomError.forbidden({ operation: "deleteRecruitPost" });
    }

    // Storage에서 이미지 삭제
    if (post.images?.length > 0) {
      await supabase.storage
        .from(process.env.SUPABASE_STORAGE_NAME!)
        .remove(post.images);
    }

    // CASCADE로 recruit_comment 자동 삭제
    const { error } = await supabase
      .from("recruit_post")
      .delete()
      .eq("id", postId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "deleteRecruitPost"
      );
    }

    return true;
  });
}
