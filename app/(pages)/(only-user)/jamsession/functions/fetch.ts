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

    ret = await supabase
      .from("jamsession")
      .insert({
        ...input,
        user_id: user.id,
        pos: ["v"],
        location: input.location.map((row) => MapLocationToData[row]),
        genre: input.genre.map((row) => MapGenreToData[row]),
        level: input.level.map((row) => MapLevelToData[row]),
      })
      .eq("id", user.id)
      .select()
      .then(async ({ data, error }) => {
        if (error || data.length === 0) throw CustomError.UnExpected;

        console.log("저장된 데이터", data);

        const images = await Promise.allSettled(
          input.images?.map(
            async (image) =>
              await supabase.storage
                .from(process.env.SUPABASE_STORAGE_NAME)
                .upload(
                  `jamsession/${data[0].id}/${image.file.name}`,
                  image.file
                )
                .then(({ data, error }) => {
                  console.log(data, error);
                  if (error) throw CustomError.UploadImage;

                  return supabase.storage
                    .from(process.env.SUPABASE_STORAGE_NAME)
                    .getPublicUrl(data.path).data.publicUrl;
                })
          )
        );
        console.log("이미지", images);

        if (images?.filter((row) => row.status === "fulfilled").length > 0) {
          const { error } = await supabase
            .from("jamsession")
            .update({
              images: images
                .filter((row) => row.status === "fulfilled")
                .map((row) => row.value),
            })
            .eq("id", data[0].id);
          if (error) {
            console.log(error);
            await supabase.from("jamsession").delete().eq("id", data[0].id);
            throw CustomError.UploadImage;
          }
        }

        return data;
      });
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
