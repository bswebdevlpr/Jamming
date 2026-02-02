"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    ret = await supabase
      .from("user_nickname")
      .select()
      .eq("nickname", nickname)
      .then((res) => !!(res.data && res.data.length === 0));
  } catch (e) {
    throw CustomError.UnExpected;
  }

  return ret;
}
