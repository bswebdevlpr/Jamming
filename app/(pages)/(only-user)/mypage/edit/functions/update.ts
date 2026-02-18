"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
  MapPositionToData,
} from "@/app/lib/maps/jam";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export interface UpdateProfileInput {
  location?: LocationEnum;
  pos?: PositionEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  is_bpm_public?: boolean;
}

export const updateProfile = async (
  input: UpdateProfileInput
): Promise<ActionResult<boolean>> => {
  return safeAction("updateProfile", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const payload: Record<string, unknown> = {};

    if (input.location !== undefined) {
      const mapped = MapLocationToData[input.location];
      if (mapped) payload.location = mapped;
    }
    if (input.pos !== undefined) {
      const mapped = MapPositionToData[input.pos];
      if (mapped) payload.pos = mapped;
    }
    if (input.genre !== undefined) {
      const mapped = MapGenreToData[input.genre];
      if (mapped) payload.genre = mapped;
    }
    if (input.level !== undefined) {
      const mapped = MapLevelToData[input.level];
      if (mapped) payload.level = mapped;
    }
    if (input.is_bpm_public !== undefined) {
      payload.is_bpm_public = input.is_bpm_public;
    }

    const { error } = await supabase
      .from("user")
      .update(payload)
      .eq("id", user.id);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "updateProfile"
      );
    }

    return true;
  });
};
