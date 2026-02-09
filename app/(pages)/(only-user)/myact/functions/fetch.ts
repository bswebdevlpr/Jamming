"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_JamEntry } from "@/app/lib/interfaces/entity.interface";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import moment from "moment";
import type { SupabaseClient } from "@supabase/supabase-js";

const validateUserEntry = async (
  supabase: SupabaseClient,
  entryId: number,
  userId: string
) => {
  const { data: entry, error } = await supabase
    .from("jamentry")
    .select("id, user_id")
    .eq("id", entryId)
    .eq("user_id", userId)
    .single();

  if (error || !entry) {
    throw CustomError.forbidden({ operation: "validateUserEntry" });
  }
  return entry;
};

export const getRejamInvitations = async (): Promise<
  ActionResult<Entity_JamEntry[]>
> => {
  return safeAction("getRejamInvitations", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "getRejamInvitations"
      );
    }

    const now = moment().toISOString();

    const { data, error } = await supabase
      .from("jamentry")
      .select(
        `
          *,
          jamsession (
            id,
            title,
            location,
            genre,
            level,
            datetime,
            headcnt_by_pos,
            user ( id, nickname, profile_image, pos )
          )
        `
      )
      .eq("user_id", user.id)
      .eq("is_rejam", true)
      .is("is_allowed", null)
      .gt("jamsession.datetime", now);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "getRejamInvitations"
      );
    }

    // jamsession이 null인 경우 필터 (과거 잼은 join에서 null 반환)
    const filtered = (data ?? []).filter((entry) => entry.jamsession);

    return filtered;
  });
};

export const acceptRejam = async (
  entryId: number,
  appliedPos: string
): Promise<ActionResult<boolean>> => {
  return safeAction("acceptRejam", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "acceptRejam"
      );
    }

    // 본인의 엔트리인지 확인
    await validateUserEntry(supabase, entryId, user.id);

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: true, applied_pos: appliedPos })
      .eq("id", entryId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "acceptRejam"
      );
    }

    return true;
  });
};

export const rejectRejam = async (
  entryId: number
): Promise<ActionResult<boolean>> => {
  return safeAction("rejectRejam", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "rejectRejam"
      );
    }

    // 본인의 엔트리인지 확인
    await validateUserEntry(supabase, entryId, user.id);

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: false })
      .eq("id", entryId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "rejectRejam"
      );
    }

    return true;
  });
};
