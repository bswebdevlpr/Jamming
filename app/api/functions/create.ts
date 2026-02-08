"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize, sanitizePublic } from "@/app/lib/functions/validate";

export async function createJamEntry(
  input: CreateJamEntryDto
): Promise<boolean> {
  try {
    input.appeal = await sanitize(input.appeal);

    const supabase = await createClient();

    const { error } = await supabase.from("jamentry").insert(input);

    if (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return false;
    }

    return true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    throw CustomError.UnExpected;
  }
}

export async function createPublicFeedback(
  input: string
): Promise<boolean> {
  try {
    const sanitized = await sanitizePublic(input);

    if (sanitized.length === 0 || sanitized.length > 100) {
      return false;
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
      if (process.env.NODE_ENV === "development") console.error(error);
      return false;
    }

    return true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    if (process.env.NODE_ENV === "development") console.error(e);
    return false;
  }
}
