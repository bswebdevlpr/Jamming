"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateBandDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function updateBand(
  bandId: number,
  input: Partial<CreateBandDto>
): Promise<ActionResult<boolean>> {
  return safeAction("updateBand", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드장 권한 확인
    const { data: band, error: bandErr } = await supabase
      .from("band")
      .select("id, leader_id")
      .eq("id", bandId)
      .single();

    if (bandErr || !band) {
      throw CustomError.invalidBand({ operation: "updateBand" });
    }
    if (band.leader_id !== user.id) {
      throw CustomError.notBandLeader({ operation: "updateBand" });
    }

    // XSS 방지
    if (input.description) {
      input.description = await sanitize(input.description);
    }

    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined) payload.description = input.description;
    if (input.genre !== undefined) payload.genre = input.genre;
    if (input.location !== undefined) payload.location = input.location;
    if (input.level !== undefined) payload.level = input.level;
    if (input.tags !== undefined) payload.tags = input.tags;

    const { error } = await supabase
      .from("band")
      .update(payload)
      .eq("id", bandId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "updateBand"
      );
    }

    return true;
  });
}
