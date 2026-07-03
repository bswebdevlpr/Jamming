"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { sanitize } from "@/app/lib/functions/validate";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { feedbackLimiter } from "@/app/lib/rate-limit";
import { FEEDBACK_CONFIG } from "@/app/lib/config/feedback";

export const initialize = async (): Promise<ActionResult<any>> => {
  return safeAction("mypage.initialize", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("user")
      .select(
        `
        *,
        playlist ( * )
      `
      )
      .eq("id", user.id)
      .single();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "mypage.initialize"
      );
    }
    if (!data) {
      throw CustomError.invalidSession({
        operation: "mypage.initialize",
      });
    }

    return data;
  });
};

export const createFeedback = async (
  input: string
): Promise<ActionResult<boolean>> => {
  return safeAction("createFeedback", async () => {
    const supabase = await createClient();
    const sanitized = await sanitize(input);
    const user = await getUser(supabase);

    // 길이 검증 (공개 피드백과 일관성)
    if (
      sanitized.length === 0 ||
      sanitized.length > FEEDBACK_CONFIG.MAX_LENGTH
    ) {
      throw CustomError.validationFailed({
        operation: "createFeedback",
      });
    }

    // 서버 측 Rate Limiting
    const identifier = `${FEEDBACK_CONFIG.IDENTIFIER_PREFIX.USER}:${user.id}`;
    const { success } = await feedbackLimiter.limit(identifier);
    if (!success) {
      throw CustomError.rateLimitExceeded({
        operation: "createFeedback",
      });
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert({
        body: sanitized,
        user_id: user.id,
      })
      .select();

    if (error || !data) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error ?? { message: "No data returned" },
        "createFeedback"
      );
    }

    return !!data;
  });
};
