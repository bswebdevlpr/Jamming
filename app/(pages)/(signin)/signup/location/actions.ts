"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { UserProfile } from "@/app/lib/interfaces/global.interface";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
  MapPositionToData,
} from "@/app/lib/maps/jam";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export default async function createUser(
  input: any
): Promise<ActionResult<UserProfile>> {
  return safeAction("createUser", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    let profile_image =
      input.profile_image &&
      (await supabase.storage
        .from(process.env.SUPABASE_STORAGE_NAME)
        .upload(
          `user/${user.id}/profile-image/${input.profile_image.name}`,
          input.profile_imagex
        )
        .then(
          (res) =>
            supabase.storage
              .from(process.env.SUPABASE_STORAGE_NAME)
              .getPublicUrl(res.data.path).data.publicUrl
        ));

    const { data, error } = await supabase
      .from("user")
      .insert({
        ...input,
        pos: MapPositionToData[input.pos],
        genre: MapGenreToData[input.genre],
        level: MapLevelToData[input.level],
        location: MapLocationToData[input.location],
        profile_image,
      })
      .select("*, playlist(*)")
      .single();

    if (error || !data) {
      throw CustomError.fromSupabaseError(
        ErrorCode.SIGNUP_FAILED,
        error ?? { message: "No data returned" },
        "createUser"
      );
    }

    return data;
  });
}
