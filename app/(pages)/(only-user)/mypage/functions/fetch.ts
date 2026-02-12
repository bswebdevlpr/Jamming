"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { sanitize } from "@/app/lib/functions/validate";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export const initialize = async (): Promise<ActionResult<any>> => {
  return safeAction("mypage.initialize", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("user")
      .select(
        `
        *,
        playlist ( * )
      `
      )
      .eq("id", user.id)
      .single();

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "mypage.initialize"
      );
    }
    if (!data) {
      throw CustomError.invalidSession({
        operation: "mypage.initialize",
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[mypage.initialize] Playlist data fetched:", {
        playlistCount: data.playlist?.length ?? "null/undefined",
        hasPlaylist: !!data.playlist,
      });
    }

    return data;
  });
};

export const createFeedback = async (
  input: string
): Promise<ActionResult<boolean>> => {
  return safeAction("createFeedback", async () => {
    const supabase = await createClient();
    const sanitized = await sanitize(input);
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("feedback")
      .insert({
        body: sanitized,
        user_id: user.id,
      })
      .select();

    if (error || !data) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error ?? { message: "No data returned" },
        "createFeedback"
      );
    }

    return !!data;
  });
};
