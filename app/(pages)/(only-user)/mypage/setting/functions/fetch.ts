"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export const initialize = async (): Promise<ActionResult<any>> => {
  return safeAction("setting.initialize", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("id", user.id)
      .single();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "setting.initialize"
      );
    }
    if (!data) {
      throw CustomError.invalidUser({ operation: "setting.initialize" });
    }

    return data;
  });
};
