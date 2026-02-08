"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export const destoryUser = async (): Promise<ActionResult<boolean>> => {
  return safeAction("destoryUser", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { error } = await supabase
      .from("user")
      .delete()
      .eq("id", user.id);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "destoryUser.deleteUser"
      );
    }

    await supabase.auth.admin.deleteUser(user.id);

    return true;
  });
};
