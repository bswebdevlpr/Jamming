"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "./read";

export const deleteJamSession = async (
  jam_id: number
): Promise<ActionResult<boolean>> => {
  return safeAction("deleteJamSession", async () => {
    const supabase = await createClient();

    await getUser(supabase);

    const { data, error } = await supabase
      .from("jamsession")
      .delete()
      .eq("id", jam_id)
      .select();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "deleteJamSession"
      );
    }

    if (data && data.length > 0 && data[0].images?.length > 0) {
      const storageName = process.env.SUPABASE_STORAGE_NAME;
      if (!storageName) throw new Error("SUPABASE_STORAGE_NAME is not defined");
      const { error: storageErr } = await supabase.storage
        .from(storageName)
        .remove(data[0].images);
      if (storageErr) {
        console.error("[deleteJamSession] Storage image removal failed:", storageErr.message);
      }
    }

    return true;
  });
};

export const deleteJamEntry = async (
  entryId: number
): Promise<ActionResult<boolean>> => {
  return safeAction("deleteJamEntry", async () => {
    const supabase = await createClient();

    const { error } = await supabase
      .from("jamentry")
      .delete()
      .eq("id", entryId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "deleteJamEntry"
      );
    }

    return true;
  });
};
