"use server";

import { CustomError } from "@/app/lib/errors/server.error";
import {
  Entity_JamEntry,
  Entity_JamSession,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
interface RetType {
  jam: Entity_JamSession;
  leader: Entity_User;
  memberEntries: Entity_JamEntry[];
  applierEntries: Entity_JamEntry[];
}

export const initialize = async (jam_id: number) => {
  let ret: RetType = {
    jam: null,
    leader: null,
    memberEntries: [],
    applierEntries: [],
  };

  try {
    const supabase = await createClient();

    const { data: jam, error: err1 } = await supabase
      .from("jamsession")
      .select(
        `
          id,
          datetime,
          created_at,
          leader:user (*),
          jamentry (*, user (*))
        `
      )
      .eq("id", jam_id)
      .single();
    if (err1) {
      console.error(err1);
      throw CustomError.UnExpected;
    }

    ret.jam = jam;
    ret.leader = jam.leader as any;
    ret.memberEntries = jam.jamentry.filter((je) => je.is_allowed);

    const {
      data: { user },
      error: err2,
    } = await supabase.auth.getUser();
    if (err2) {
      console.error(err2);
      throw CustomError.UnExpected;
    }

    if ((jam.leader as any)?.id === user.id)
      ret.applierEntries = jam.jamentry.filter((je) => je.is_allowed === null);
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
