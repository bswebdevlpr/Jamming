"use server";

import { CustomError } from "@/app/lib/errors/error";
import { FormData_Post } from "@/app/lib/zod";
import { createClient } from "@/app/util/supabase/server";

export async function createJam(data: FormData_Post): Promise<boolean> {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("jamsession").insert(data);
    ret = !!error;
  } catch (e) {
    throw CustomError.UnExpected;
  }

  return ret;
}
