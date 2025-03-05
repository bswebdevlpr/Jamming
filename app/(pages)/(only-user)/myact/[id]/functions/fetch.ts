"use server";

import { CustomError } from "@/app/lib/errors/server.error";
import { createClient } from "@/app/util/supabase/server";
import moment from "moment";

export const allowEntry = async (entryId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    await validateAuth(supabase, "entry", entryId);

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: true })
      .eq("id", entryId)
      .select();
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const refuseEntry = async (entryId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    await validateAuth(supabase, "entry", entryId);

    const { error } = await supabase
      .from("jamentry")
      .update({ is_allowed: false })
      .eq("id", entryId);
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const setNoShow = async (entryId: number, noshow: boolean) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    await validateAuth(supabase, "entry", entryId);

    const { error, status, statusText } = await supabase
      .from("jamentry")
      .update({ noshow })
      .eq("id", entryId);
    console.log(error, status, statusText);
    if (error) throw CustomError.UnExpected;
    else ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

const validateAuth = async (
  supabase,
  type: "jam" | "entry",
  targetId: number
) => {
  try {
    const user = await getUser(supabase);

    if (type === "jam") {
      const { data, error } = await supabase
        .from("jamsession")
        .select()
        .eq("id", targetId)
        .eq("user_id", user.id)
        .single();
      if (error) throw CustomError.UnExpected;
      else if (!data) throw CustomError.Forbidden;
    } else if (type === "entry") {
      const { data, error } = await supabase.rpc("validate-user-jamentry", {
        entry_id: targetId,
        user_id: user.id,
      });
      if (error) throw CustomError.UnExpected;
      else if (!data) throw CustomError.Forbidden;
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
};

export const getJamSchedule = async () => {
  let ret = [];

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const now = moment();
    const { data, error } = await supabase
      .from("jamentry")
      .select(
        `
          *,
          jamsession (id, date)
        `
      )
      .eq("user_id", user.id)
      .eq("is_allowed", true)
      .gt("jamsession.date", now.toISOString())
      .lte("jamsession.date", now.clone().add(2, "week").toISOString());
    if (error) throw CustomError.UnExpected;
    else ret = data.filter((row) => row.jamsession);
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

const getUser = async (supabase) => {
  let ret = null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw CustomError.UnExpected;
    else if (!user) throw CustomError.InvalidUserSession;
    else ret = user;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
