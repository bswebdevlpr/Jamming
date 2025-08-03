"use server";

import { CustomError } from "@/app/lib/errors/server.error";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "./read";

export const deleteJamSession = async (jam_id: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    // validation
    await getUser(supabase);

    const { data, error } = await supabase
      .from("jamsession")
      .delete()
      .eq("id", jam_id)
      .select();
    if (error) throw CustomError.UnExpected;
    else {
      if (data[0].images.length > 0)
        await supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME)
          .remove(data[0].images);

      ret = true;
    }
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const deleteJamEntry = async (entryId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("jamentry")
      .delete()
      .eq("id", entryId);
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
