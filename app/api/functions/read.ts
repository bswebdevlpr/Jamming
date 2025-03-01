"use server";

import { CustomError } from "@/app/lib/errors/error";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";

export async function getJam(id: number): Promise<Entity_JamSession> {
  let ret: Entity_JamSession = null;

  try {
    const supabase = await createClient();
    await supabase
      .from("jamsession")
      .select(
        `
            *,
            user ( nickname, pos, genre, level, bpm ),
            jamentry ( id, jamId, userId )
        `
      )
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) ret = data;
      });
  } catch (e) {
    throw CustomError.InvalidJam;
  }

  return ret;
}
