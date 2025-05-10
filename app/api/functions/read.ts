"use server";

import { CustomError } from "@/app/lib/errors/server.error";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { User } from "@supabase/supabase-js";

export const getUser: (supabase: any) => Promise<User> = async (supabase) => {
  let ret: User = null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw CustomError.UnExpected;
    else if (!user) throw CustomError.InvalidUserSession;
    else ret = user;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export async function getJam(id: number): Promise<Entity_JamSession> {
  let ret: Entity_JamSession = null;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("jamsession")
      .select(
        `
            *,
            user ( nickname, pos, genre, level, bpm ),
            jamentry ( id, jam_id, user_id, applied_pos )
        `
      )
      .eq("id", id)
      .single();
    if (error) throw CustomError.UnExpected;
    if (!data) throw CustomError.InvalidJam;

    data.curHeadCnt = data.jamentry.length;
    data.maxHeadCnt = data.headcnt_by_pos.reduce(
      (acc, cur) => acc + cur.headcnt,
      0
    );
    data.appliedPosDict = data.jamentry.reduce(
      (acc, cur) => {
        if (typeof acc[cur.pos] === "number") acc[cur.pos].headcnt++;
        else acc[cur.pos] = 0;
        return acc;
      },
      data.headcnt_by_pos.reduce((acc, cur) => {
        if (cur.headcnt > 0) acc[cur.pos] = 0;
        return acc;
      }, {})
    );
    data.images = data.images.map(
      (row) =>
        supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME)
          .getPublicUrl(`${user.id}/jamsession/${id}/${row}`).data.publicUrl
    );

    ret = data;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
}
