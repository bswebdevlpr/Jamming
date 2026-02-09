"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    return await supabase
      .from("user_nickname")
      .select()
      .eq("nickname", nickname)
      .then((res) => !!(res.data && res.data.length === 0));
  } catch (e) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      e instanceof Error ? { message: e.message } : { message: String(e) },
      "isNicknameUnique"
    );
  }
}
