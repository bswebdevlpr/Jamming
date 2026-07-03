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

    const user = await getUser(supabase);

    // 소유권 검증: 세션 호스트만 삭제 가능 (RLS에만 의존하지 않는 방어심층)
    const { data: jam, error: jamError } = await supabase
      .from("jamsession")
      .select("id, user_id")
      .eq("id", jam_id)
      .single();
    if (jamError || !jam) {
      throw CustomError.invalidJam({ operation: "deleteJamSession" });
    }
    if (jam.user_id !== user.id) {
      throw CustomError.forbidden({ operation: "deleteJamSession" });
    }

    const { data, error } = await supabase
      .from("jamsession")
      .delete()
      .eq("id", jam_id)
      .eq("user_id", user.id)
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

    const user = await getUser(supabase);

    // 신청 정보 조회 (신청자 본인 또는 세션 호스트만 삭제 가능)
    const { data: entry, error: entryError } = await supabase
      .from("jamentry")
      .select("id, user_id, jam_id")
      .eq("id", entryId)
      .single();
    if (entryError || !entry) {
      throw CustomError.invalidJam({ operation: "deleteJamEntry" });
    }

    let authorized = entry.user_id === user.id;
    if (!authorized) {
      // 신청자가 아니면 세션 호스트인지 확인
      const { data: jam } = await supabase
        .from("jamsession")
        .select("user_id")
        .eq("id", entry.jam_id)
        .single();
      authorized = jam?.user_id === user.id;
    }
    if (!authorized) {
      throw CustomError.forbidden({ operation: "deleteJamEntry" });
    }

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
