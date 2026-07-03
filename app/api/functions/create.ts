"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize, sanitizePublic } from "@/app/lib/functions/validate";
import {
  feedbackLimiter,
  getClientIPFromHeaders,
} from "@/app/lib/rate-limit";
import { FEEDBACK_CONFIG } from "@/app/lib/config/feedback";
import { createNotification } from "@/app/lib/notifications";

export async function createJamEntry(
  input: CreateJamEntryDto
): Promise<ActionResult<boolean>> {
  return safeAction("createJamEntry", async () => {
    input.appeal = await sanitize(input.appeal);

    const supabase = await createClient();

    const { error } = await supabase.from("jamentry").insert(input);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "createJamEntry"
      );
    }

    // 호스트에게 알림 (부수 효과 — 실패해도 신청 자체는 성공)
    try {
      const [{ data: jamData }, { data: userData }] = await Promise.all([
        supabase
          .from("jamsession")
          .select("user_id, title")
          .eq("id", input.jam_id)
          .single(),
        supabase
          .from("user")
          .select("nickname")
          .eq("id", input.user_id)
          .single(),
      ]);

      if (jamData?.user_id && jamData.user_id !== input.user_id) {
        const nickname = userData?.nickname ?? "누군가";
        await createNotification(
          jamData.user_id,
          "jam_apply",
          "새로운 잼 신청이 도착했어요",
          `${nickname}님이 '${jamData.title}'에 참가 신청했어요`,
          { jam_id: input.jam_id, applicant_id: input.user_id }
        );
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.error("[알림 발송 실패] createJamEntry:", e);
    }

    return true;
  });
}

export async function createPublicFeedback(
  input: string
): Promise<ActionResult<boolean>> {
  return safeAction("createPublicFeedback", async () => {
    const sanitized = await sanitizePublic(input);

    if (
      sanitized.length === 0 ||
      sanitized.length > FEEDBACK_CONFIG.MAX_LENGTH
    ) {
      throw CustomError.validationFailed({
        operation: "createPublicFeedback",
      });
    }

    const supabase = await createClient();

    let userId: string | null = null;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }

    // 서버 측 Rate Limiting
    const identifier = userId
      ? `${FEEDBACK_CONFIG.IDENTIFIER_PREFIX.USER}:${userId}`
      : `${FEEDBACK_CONFIG.IDENTIFIER_PREFIX.IP}:${await getClientIPFromHeaders()}`;

    const { success } = await feedbackLimiter.limit(identifier);
    if (!success) {
      throw CustomError.rateLimitExceeded({
        operation: "createPublicFeedback",
      });
    }

    const { error } = await supabase.from("feedback").insert({
      body: sanitized,
      user_id: userId,
    });

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "createPublicFeedback"
      );
    }

    return true;
  });
}
