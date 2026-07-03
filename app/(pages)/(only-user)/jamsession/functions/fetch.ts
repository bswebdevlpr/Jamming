"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
} from "@/app/lib/maps/jam";
import { ZodType_Post } from "@/app/lib/zod";
import { createClient } from "@/app/util/supabase/server";
import { sanitize } from "@/app/lib/functions/validate";

export const createJam = async (
  input: ZodType_Post
): Promise<ActionResult<any>> => {
  return safeAction("createJam", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 사용자 입력 sanitize (다른 콘텐츠 작성 액션과 일관성 유지)
    input.title = await sanitize(input.title);
    input.body = await sanitize(input.body);

    const result = await supabase
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
        if (error || data.length === 0) {
          throw CustomError.fromSupabaseError(
            ErrorCode.UNEXPECTED,
            error ?? { message: "No data returned" },
            "createJam.insert"
          );
        }

        const images = await Promise.allSettled(
          input.images?.map(
            async (image) =>
              await supabase.storage
                .from(process.env.SUPABASE_STORAGE_NAME)
                .upload(
                  `jamsession/${data[0].id}/${image.file.name}`,
                  image.file
                )
                .then(({ data: uploadData, error }) => {
                  if (error) {
                    throw CustomError.imageUploadFailed({
                      operation: "createJam.uploadImage",
                      supabaseMessage: error.message,
                    });
                  }

                  return supabase.storage
                    .from(process.env.SUPABASE_STORAGE_NAME)
                    .getPublicUrl(uploadData.path).data.publicUrl;
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
            throw CustomError.imageUploadFailed({
              operation: "createJam.updateImages",
              supabaseCode: error.code,
              supabaseMessage: error.message,
            });
          }
        }

        return data;
      });

    return result;
  });
};

interface UpdateJamOptions {
  preservedImages?: string[];
}

export const updateJam = async (
  jam_id: number,
  input: ZodType_Post,
  options?: UpdateJamOptions
): Promise<ActionResult<any>> => {
  return safeAction("updateJam", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data: jam, error: jamError } = await supabase
      .from("jamsession")
      .select("id, user_id, images")
      .eq("id", jam_id)
      .single();
    if (jamError || !jam) {
      throw CustomError.fromSupabaseError(
        ErrorCode.INVALID_JAM,
        jamError ?? { message: "Jam not found" },
        "updateJam.getJam"
      );
    }
    if (jam.user_id !== user.id) {
      throw CustomError.forbidden({ operation: "updateJam" });
    }

    // 사용자 입력 sanitize
    input.title = await sanitize(input.title);
    input.body = await sanitize(input.body);

    const preservedImages =
      options?.preservedImages ?? (Array.isArray(jam.images) ? jam.images : []);

    const uploadResults = await Promise.allSettled(
      input.images?.map(async (image) => {
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME)
          .upload(`jamsession/${jam_id}/${image.file.name}`, image.file, {
            upsert: true,
          });
        if (error) {
          throw CustomError.imageUploadFailed({
            operation: "updateJam.uploadImage",
            supabaseMessage: error.message,
          });
        }

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

    const result = await supabase
      .from("jamsession")
      .update(payload)
      .eq("id", jam_id)
      .select()
      .then(({ data, error }) => {
        if (error || data.length === 0) {
          throw CustomError.fromSupabaseError(
            ErrorCode.UNEXPECTED,
            error ?? { message: "Update returned no data" },
            "updateJam.update"
          );
        }
        return data[0];
      });

    return result;
  });
};
