"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";

export const destoryUser = async () => {
  let ret = null;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    await supabase
      .from("user")
      .delete()
      .eq("id", user.id)
      .then(async ({ error }) => {
        if (error) throw CustomError.UnExpected;
        else await supabase.auth.admin.deleteUser(user.id);
      });

    ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
