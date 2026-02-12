"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";
import { nicknameCheckLimiter } from "@/app/lib/rate-limit";

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  try {
    // Rate limiting: 닉네임 기반 (같은 닉네임을 여러 번 검사하는 것 제한)
    const identifier = `nickname:${nickname}`;
    const { success } = await nicknameCheckLimiter.limit(identifier);

    if (!success) {
      throw CustomError.rateLimitExceeded({ operation: "isNicknameUnique" });
    }

    const supabase = await createClient();

    return await supabase
      .from("user_nickname")
      .select()
      .eq("nickname", nickname)
      .then((res) => !!(res.data && res.data.length === 0));
  } catch (e) {
    if (e instanceof CustomError) throw e;
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      e instanceof Error ? { message: e.message } : { message: String(e) },
      "isNicknameUnique"
    );
  }
}
