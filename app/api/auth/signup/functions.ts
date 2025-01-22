"use server";

import { supabase } from "@/app/util/supabase/auth";

export async function isNicknameUnique() {
  // let ret: boolean = false;

  const ret = await supabase
    .from("user_nickname")
    .select()
    .then((res) => res.data);
  console.log(ret);
  // try {

  // } catch (e) {
  //     throw new Error(CustomError.UnExpected)
  // }
}
