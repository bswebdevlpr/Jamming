"use server";

import { CustomError } from "@/app/lib/errors/client.error";
import { createClient } from "@/app/util/supabase/server";

export const deleteJamSession = async (jamId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("jamsession")
      .delete()
      .eq("id", jamId);
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
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
