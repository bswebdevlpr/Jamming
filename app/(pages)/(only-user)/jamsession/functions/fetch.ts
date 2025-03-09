"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/client.error";
import { FormData_Post } from "@/app/lib/zod";
import { createClient } from "@/app/util/supabase/server";

export const createJam = async (input: FormData_Post) => {
  let ret = null;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("jamsession")
      .insert(Object.assign(input, { user_id: user.id }))
      .eq("id", user.id)
      .select();
    console.log(data, error);
    if (error || data.length === 0) throw CustomError.UnExpected;

    ret = data;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
