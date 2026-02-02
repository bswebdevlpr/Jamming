"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/custom-error";
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
                  if (error) throw CustomError.UploadImage;

                  return supabase.storage
                    .from(process.env.SUPABASE_STORAGE_NAME)
                    .getPublicUrl(data.path).data.publicUrl;
                })
          )
        );

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

interface UpdateJamOptions {
  preservedImages?: string[];
}

export const updateJam = async (
  jam_id: number,
  input: ZodType_Post,
  options?: UpdateJamOptions
) => {
  let ret = null;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const { data: jam, error: jamError } = await supabase
      .from("jamsession")
      .select("id, user_id, images")
      .eq("id", jam_id)
      .single();
    if (jamError || !jam) throw CustomError.InvalidJam;
    if (jam.user_id !== user.id) throw CustomError.Forbidden;

    const preservedImages =
      options?.preservedImages ?? (Array.isArray(jam.images) ? jam.images : []);

    const uploadResults = await Promise.allSettled(
      input.images?.map(async (image) => {
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME)
          .upload(`jamsession/${jam_id}/${image.file.name}`, image.file, {
            upsert: true,
          });
        if (error) throw CustomError.UploadImage;

        return supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME)
          .getPublicUrl(data.path).data.publicUrl;
      }) ?? []
    );

    const uploadedImages = uploadResults
      .filter(
        (result): result is PromiseFulfilledResult<string> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    const nextImages = [...preservedImages, ...uploadedImages];

    const payload = {
      title: input.title,
      body: input.body,
      location: input.location.map((row) => MapLocationToData[row]),
      genre: input.genre.map((row) => MapGenreToData[row]),
      level: input.level.map((row) => MapLevelToData[row]),
      headcnt_by_pos: input.headcnt_by_pos,
      datetime: input.datetime,
      songs: input.songs,
      images: nextImages,
      location_detail: input.location_detail,
      openchat: input.openchat,
      pos: ["v"],
    };

    ret = await supabase
      .from("jamsession")
      .update(payload)
      .eq("id", jam_id)
      .select()
      .then(({ data, error }) => {
        if (error || data.length === 0) throw CustomError.UnExpected;
        return data[0];
      });
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
