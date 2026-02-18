"use server";

import {
  CustomError,
  ErrorCode,
} from "@/app/lib/errors/custom-error";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import { logger } from "@/app/lib/logger";
import { createClient } from "@/app/util/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";

export const getUser = async (supabase: SupabaseClient): Promise<User> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw CustomError.fromAuthError(
      ErrorCode.INVALID_SESSION,
      error,
      "getUser"
    );
  }
  if (!user) {
    throw CustomError.invalidSession({ operation: "getUser" });
  }

  return user;
};

function processJamData(data: any): Entity_JamSession {
  data.curHeadCnt = data.jamentry.length;
  data.maxHeadCnt = data.headcnt_by_pos.reduce(
    (acc: number, cur: { headcnt: number }) => acc + cur.headcnt,
    0
  );
  data.appliedPosDict = data.jamentry.reduce(
    (acc: Record<string, number>, cur: { applied_pos: string }) => {
      const pos = cur.applied_pos;
      if (typeof acc[pos] === "number") acc[pos]++;
      else acc[pos] = 1;
      return acc;
    },
    data.headcnt_by_pos.reduce(
      (acc: Record<string, number>, cur: { pos: string; headcnt: number }) => {
        if (cur.headcnt > 0) acc[cur.pos] = 0;
        return acc;
      },
      {} as Record<string, number>
    )
  );
  return data;
}

const JAM_SELECT_QUERY = `
  *,
  user ( nickname, pos, genre, level, bpm, is_bpm_public, profile_image ),
  jamentry ( id, jam_id, user_id, applied_pos )
`;

const JAM_PUBLIC_SELECT_QUERY = `
  *,
  user ( nickname, pos, genre, level, bpm, is_bpm_public, profile_image ),
  jamentry ( applied_pos )
`;

export async function getJam(id: number): Promise<Entity_JamSession> {
  const supabase = await createClient();

  // 인증 확인
  await getUser(supabase);

  const { data, error } = await supabase
    .from("jamsession")
    .select(JAM_SELECT_QUERY)
    .eq("id", id)
    .single();

  if (error) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      error,
      "getJam"
    );
  }
  if (!data) {
    throw CustomError.invalidJam({ operation: "getJam" });
  }

  return processJamData(data);
}

export async function getJamPublic(id: number): Promise<Entity_JamSession | null> {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const twoWeeksLater = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("jamsession")
    .select(JAM_PUBLIC_SELECT_QUERY)
    .eq("id", id)
    .gte("datetime", now)
    .lte("datetime", twoWeeksLater)
    .single();

  if (error || !data) {
    if (error) {
      logger.warn("getJamPublic", "Public jam query returned error", {
        supabaseCode: error.code,
        supabaseMessage: error.message,
      });
    }
    return null;
  }

  return processJamData(data);
}
