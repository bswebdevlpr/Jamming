"use server";

import { CustomError } from "@/app/lib/errors/client.error";
import { UserProfile } from "@/app/lib/interfaces/global.interface";
import { createClient } from "@/app/util/supabase/server";

const supabase = await createClient();

export default async function createUser(input: any): Promise<UserProfile> {
  let ret: UserProfile = null;

  try {
    const { data, error } = await supabase
      .from("user")
      .insert(input)
      .select()
      .single();
    if (error) throw new Error();

    ret = data;
  } catch (e) {
    throw CustomError.SignUp;
  }

  return ret;
}
