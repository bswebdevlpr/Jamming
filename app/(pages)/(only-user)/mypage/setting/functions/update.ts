"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export const updateNotiAccept = async (
  value: boolean
): Promise<ActionResult<boolean>> => {
  return safeAction("updateNotiAccept", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { error } = await supabase
      .from("user")
      .update({ allow_noti: value })
      .eq("id", user.id)
      .single();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "updateNotiAccept"
      );
    }

    return true;
  });
};
