"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export const getUserByNickname = async (
  nickname: string
): Promise<ActionResult<any>> => {
  return safeAction("getUserByNickname", async () => {
    const supabase = await createClient();

    await getUser(supabase);

    const { data, error } = await supabase
      .from("user")
      .select(
        `
          *,
          playlist(*)
        `
      )
      .eq("nickname", nickname)
      .single();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "getUserByNickname"
      );
    }
    if (!data) {
      throw CustomError.invalidUser({ operation: "getUserByNickname" });
    }

    return data;
  });
};
