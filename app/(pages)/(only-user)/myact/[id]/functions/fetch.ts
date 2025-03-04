"use server";

import { CustomError } from "@/app/lib/errors/error";
import { createClient } from "@/app/util/supabase/server";

export const allowEntry = async (jamId: number, entryId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: true })
      .eq("id", entryId)
      .filter(
        "jam_id",
        "eq",
        supabase
          .from("jamsession")
          .select("id")
          .eq("jam_id", jamId)
          .eq("user_id", user.id)
      )
      .select();
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const refuseEntry = async (jamId: number, entryId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: false })
      .eq("id", entryId)
      .filter(
        "jam_id",
        "eq",
        supabase
          .from("jamsession")
          .select("id")
          .eq("jam_id", jamId)
          .eq("user_id", user.id)
      );
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const setNoShow = async (
  jamId: number,
  entryId: number,
  noshow: boolean
) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(jamId, entryId);

    const { error } = await supabase
      .from("jamentry")
      .update({ noshow })
      .eq("id", entryId)
      .filter(
        "jam_id",
        "eq",
        supabase
          .from("jamsession")
          .select("id")
          .eq("jam_id", jamId)
          .eq("user_id", user.id)
      );
    console.log(
      error,
      CustomError.UnExpected,
      new CustomError("외 안만들어짐?")
    );
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    console.log(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
};
