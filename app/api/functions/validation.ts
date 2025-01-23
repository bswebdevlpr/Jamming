"use server";

import { createClient } from "@/app/util/supabase/server";

export async function validateNickname(nickname: string): Promise<boolean> {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const result = await supabase
      .from("user_nickname")
      .select()
      .eq("nickname", nickname);
    console.log(result);
  } catch (e) {
    throw new Error("이미 존재하는 닉네임입니다.");
  }

  return ret;
}
