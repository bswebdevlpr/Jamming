"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/server.error";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
} from "@/app/lib/maps/jam";
import { ZodType_Post } from "@/app/lib/zod";
import { createClient } from "@/app/util/supabase/server";

export const createJam = async (input: ZodType_Post) => {
  let ret = null;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const originImages = input.images;

    const { data, error } = await supabase
      .from("jamsession")
      .insert({
        ...input,
        user_id: user.id,
        pos: ["v"],
        location: input.location.map((row) => MapLocationToData[row]),
        genre: input.genre.map((row) => MapGenreToData[row]),
        level: input.level.map((row) => MapLevelToData[row]),
        images: input.images.map((row) => row.file.name),
      })
      .eq("id", user.id)
      .select();
    if (error || data.length === 0) throw CustomError.UnExpected;
    else {
      for (let image of originImages) {
        // TODO: 에러 핸들링
        await supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME)
          .upload(`jamsession/${data[0].id}/${image.file.name}`, image.file);
      }
    }

    ret = data;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
