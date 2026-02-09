"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize, sanitizePublic } from "@/app/lib/functions/validate";

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

    return true;
  });
}

export async function createPublicFeedback(
  input: string
): Promise<ActionResult<boolean>> {
  return safeAction("createPublicFeedback", async () => {
    const sanitized = await sanitizePublic(input);

    if (sanitized.length === 0 || sanitized.length > 100) {
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
