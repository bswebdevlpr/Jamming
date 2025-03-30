"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/server.error";
import { createClient } from "@/app/util/supabase/server";

export const updateNotiAccept = async (value: boolean) => {
  let ret = null;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const { error } = await supabase
      .from("user")
      .update({
        allow_noti: value,
      })
      .eq("id", user.id)
      .single();
    if (error) throw CustomError.UnExpected;

    ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
