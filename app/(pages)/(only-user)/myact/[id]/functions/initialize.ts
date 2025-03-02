"use server";

import { CustomError } from "@/app/lib/errors/error";
import {
  Entity_JamEntry,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
interface RetType {
  leader: Entity_User;
  memberEntries: Entity_JamEntry[];
  applierEntries: Entity_JamEntry[];
}

export const initialize = async (jamId: number) => {
  let ret: RetType = {
    leader: null,
    memberEntries: [],
    applierEntries: [],
  };

  try {
    const supabase = await createClient();

    const { data: jam, error } = await supabase
      .from("jamsession")
      .select(
        `
          leader:user!inner (*),
          jamentry!inner (*, user!inner (*))
        `
      )
      .eq("id", jamId)
      .single();
    if (error) throw CustomError.UnExpected;

    ret.leader = jam.leader as any;
    ret.memberEntries = jam.jamentry.filter((je) => je.is_allowed);
    ret.applierEntries = jam.jamentry.filter((je) => !je.is_allowed);
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
