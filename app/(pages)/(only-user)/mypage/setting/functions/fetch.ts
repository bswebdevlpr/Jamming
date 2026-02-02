"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";

export const initialize = async () => {
  let ret = null;

  try {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("id", user.id)
      .single();
    if (error) throw CustomError.UnExpected;
    else if (!data) throw CustomError.InvalidUser;

    ret = data;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
