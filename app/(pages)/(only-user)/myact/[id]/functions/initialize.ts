"use server";

import { CustomError } from "@/app/lib/errors/error";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
interface RetType {
  leader: Entity_User;
  members: Entity_User[];
  appliers: Entity_User[];
}

export const initialize = async (jamId: number) => {
  let ret: RetType = {
    leader: null,
    members: [],
    appliers: [],
  };

  try {
    const supabase = await createClient();

    const { data: jam, error } = await supabase
      .from("jamsession")
      .select(
        `
          leader:user!inner (*),
          jamentry!inner (isAllowed, user!inner (*))
        `
      )
      .eq("id", jamId)
      .single();
    if (error) throw CustomError.UnExpected;

    ret.leader = jam.leader as any;
    ret.members = jam.jamentry
      .filter((je) => je.isAllowed)
      .map((je) => je.user as any);
    ret.appliers = jam.jamentry
      .filter((je) => !je.isAllowed)
      .map((je) => je.user as any);
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
