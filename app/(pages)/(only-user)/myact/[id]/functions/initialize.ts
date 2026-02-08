"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import {
  Entity_JamEntry,
  Entity_JamSession,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

interface RetType {
  jam: Entity_JamSession;
  leader: Entity_User;
  memberEntries: Entity_JamEntry[];
  applierEntries: Entity_JamEntry[];
}

export const initialize = async (
  jam_id: number
): Promise<ActionResult<RetType>> => {
  return safeAction("myactDetail.initialize", async () => {
    const ret: RetType = {
      jam: null,
      leader: null,
      memberEntries: [],
      applierEntries: [],
    };

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
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        err1,
        "myactDetail.initialize.getJam"
      );
    }

    ret.jam = jam;
    ret.leader = jam.leader as any;
    ret.memberEntries = jam.jamentry.filter((je) => je.is_allowed);

    const {
      data: { user },
      error: err2,
    } = await supabase.auth.getUser();

    if (err2) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        err2,
        "myactDetail.initialize.getUser"
      );
    }

    if ((jam.leader as any)?.id === user.id)
      ret.applierEntries = jam.jamentry.filter(
        (je) => je.is_allowed === null && !je.is_rejam
      );

    return ret;
  });
};
