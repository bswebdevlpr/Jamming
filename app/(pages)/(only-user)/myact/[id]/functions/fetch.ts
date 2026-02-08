"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { sanitize } from "@/app/lib/functions/validate";
import { createNotification } from "@/app/api/functions/notification";
import moment from "moment";
import type { SupabaseClient } from "@supabase/supabase-js";
import { REJAM_CONSTANTS } from "@/app/lib/constants/rejam";

export const allowEntry = async (
  entryId: number
): Promise<ActionResult<boolean>> => {
  return safeAction("allowEntry", async () => {
    const supabase = await createClient();
    await validateAuth(supabase, "entry", entryId);

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: true })
      .eq("id", entryId)
      .select();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "allowEntry"
      );
    }

    return true;
  });
};

export const refuseEntry = async (
  entryId: number
): Promise<ActionResult<boolean>> => {
  return safeAction("refuseEntry", async () => {
    const supabase = await createClient();
    await validateAuth(supabase, "entry", entryId);

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: false })
      .eq("id", entryId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "refuseEntry"
      );
    }

    return true;
  });
};

export const setNoShow = async (
  entryId: number,
  noshow: boolean
): Promise<ActionResult<boolean>> => {
  return safeAction("setNoShow", async () => {
    const supabase = await createClient();
    await validateAuth(supabase, "entry", entryId);

    const { error } = await supabase
      .from("jamentry")
      .update({ noshow })
      .eq("id", entryId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "setNoShow"
      );
    }

    return true;
  });
};

const validateAuth = async (
  supabase: SupabaseClient,
  type: "jam" | "entry",
  targetId: number
) => {
  const user = await getUser(supabase);

  if (type === "jam") {
    const { data, error } = await supabase
      .from("jamsession")
      .select()
      .eq("id", targetId)
      .eq("user_id", user.id)
      .single();
    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "validateAuth.jam"
      );
    }
    if (!data) {
      throw CustomError.forbidden({ operation: "validateAuth.jam" });
    }
  } else if (type === "entry") {
    const { data, error } = await supabase.rpc("validate-user-jamentry", {
      entry_id: targetId,
      user_id: user.id,
    });
    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "validateAuth.entry"
      );
    }
    if (!data) {
      throw CustomError.forbidden({ operation: "validateAuth.entry" });
    }
  }
};

export const getJamSchedule = async (
  targetUserId: string
): Promise<ActionResult<any[]>> => {
  return safeAction("getJamSchedule", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const now = moment();
    const result = await supabase
      .from("jamentry")
      .select(
        `
          *,
          jamsession (
            id,
            title,
            location,
            genre,
            pos,
            level,
            datetime,
            headcnt_by_pos,
            user ( id ),
            jamentry ( id )
          )
        `
      )
      .eq("user_id", user.id)
      .neq("jamsession.user.id", targetUserId)
      .eq("is_allowed", true)
      .gt("jamsession.datetime", now.toISOString())
      .lte(
        "jamsession.datetime",
        now
          .clone()
          .add(REJAM_CONSTANTS.SCHEDULE_WINDOW_WEEKS, "week")
          .toISOString()
      )
      .then(({ data, error }) => {
        if (error) {
          throw CustomError.fromSupabaseError(
            ErrorCode.UNEXPECTED,
            error,
            "getJamSchedule"
          );
        }

        let filtered = data;
        if (data.length > 0) {
          filtered = data
            .filter((row) => row.jamsession)
            .map((row) => row.jamsession)
            .map((row) => {
              row.curHeadCnt = row.jamentry.length;
              return row;
            });
        }

        return filtered;
      });

    return result;
  });
};

export const sendRejam = async (
  targetUserId: string,
  jamIds: number[],
  appeal: string
): Promise<ActionResult<boolean>> => {
  return safeAction("sendRejam", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const sanitizedAppeal = await sanitize(appeal);

    // 각 잼에 대해 호스트 인증 검증
    for (const jamId of jamIds) {
      await validateAuth(supabase, "jam", jamId);
    }

    // 중복 체크: 이미 해당 잼에 리잼 초대가 있는지 확인
    const { data: existing, error: checkErr } = await supabase
      .from("jamentry")
      .select("jam_id")
      .eq("user_id", targetUserId)
      .eq("is_rejam", true)
      .in("jam_id", jamIds);

    if (checkErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        checkErr,
        "sendRejam.checkDuplicate"
      );
    }

    const existingJamIds = new Set(existing?.map((e) => e.jam_id) ?? []);
    const newJamIds = jamIds.filter((id) => !existingJamIds.has(id));

    if (newJamIds.length === 0) {
      return true;
    }

    // 벌크 insert
    const entries = newJamIds.map((jamId) => ({
      user_id: targetUserId,
      jam_id: jamId,
      appeal: sanitizedAppeal,
      applied_pos: "",
      is_rejam: true,
      is_allowed: null,
    }));

    const { error: insertErr } = await supabase
      .from("jamentry")
      .insert(entries);

    if (insertErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        insertErr,
        "sendRejam.insert"
      );
    }

    // 잼 세션 제목 조회 (알림용)
    const { data: jamData } = await supabase
      .from("jamsession")
      .select("id, title")
      .in("id", newJamIds);

    const { data: userData } = await supabase
      .from("user")
      .select("nickname")
      .eq("id", user.id)
      .single();

    const jamTitles = jamData?.map((j) => j.title).join(", ") ?? "";

    // 알림 생성
    await createNotification(
      targetUserId,
      "rejam",
      "REJAM! 초대가 도착했어요",
      `${userData?.nickname ?? "호스트"}님이 잼 세션에 초대했어요: ${jamTitles}`,
      {
        jam_ids: newJamIds,
        sender_id: user.id,
        sender_nickname: userData?.nickname ?? "",
      }
    );

    return true;
  });
};

const getUser = async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw CustomError.fromAuthError(
      ErrorCode.INVALID_SESSION,
      error,
      "myact.getUser"
    );
  }
  if (!user) {
    throw CustomError.invalidSession({ operation: "myact.getUser" });
  }

  return user;
};
