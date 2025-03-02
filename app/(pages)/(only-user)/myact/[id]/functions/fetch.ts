"use server";

import { CustomError } from "@/app/lib/errors/error";
import { createClient } from "@/app/util/supabase/server";

export const allowEntry = async (entryId: number) => {
  let ret: boolean = false;

  try {
    console.log("entryId:", entryId);

    const supabase = await createClient();

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: true })
      .eq("id", entryId)
      .select();
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const refuseEntry = async (entryId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: false })
      .eq("id", entryId);
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
