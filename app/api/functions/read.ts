"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";

export const getUser = async (supabase: SupabaseClient): Promise<User> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    throw CustomError.UnExpected;
  }
  if (!user) {
    throw CustomError.InvalidUserSession;
  }

  return user;
};

export async function getJam(id: number): Promise<Entity_JamSession> {
  const supabase = await createClient();

  // 인증 확인
  await getUser(supabase);

  const { data, error } = await supabase
    .from("jamsession")
    .select(
      `
          *,
          user ( nickname, pos, genre, level, bpm, profile_image ),
          jamentry ( id, jam_id, user_id, applied_pos )
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    throw CustomError.UnExpected;
  }
  if (!data) {
    throw CustomError.InvalidJam;
  }

  data.curHeadCnt = data.jamentry.length;
  data.maxHeadCnt = data.headcnt_by_pos.reduce(
    (acc, cur) => acc + cur.headcnt,
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
