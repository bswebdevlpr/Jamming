"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateBandDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
} from "@/app/lib/maps/jam";
import { IMAGE_UPLOAD } from "@/app/lib/constants/image";
import sharp from "sharp";

export async function updateBand(
  bandId: string,
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
    if (input.genre !== undefined)
      payload.genre = input.genre.map((g) => MapGenreToData[g]);
    if (input.location !== undefined)
      payload.location = MapLocationToData[input.location];
    if (input.level !== undefined) payload.level = MapLevelToData[input.level];
    if (input.tags !== undefined) payload.tags = input.tags;

    // 프로필 이미지 업로드
    if (input.profile_image) {
      const file = input.profile_image;

      if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
        throw CustomError.validationFailed({ operation: "updateBand" });
      }
      if (file.type && !file.type.startsWith("image/")) {
        throw CustomError.validationFailed({ operation: "updateBand" });
      }

      const storageName = process.env.SUPABASE_STORAGE_NAME;
      if (!storageName) throw new Error("SUPABASE_STORAGE_NAME is not defined");

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimized = await sharp(buffer)
          .resize(500, 500, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        const uploadResult = await supabase.storage
          .from(storageName)
          .upload(`band/${bandId}/profile-image/profile.webp`, optimized, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadResult.error) {
          throw CustomError.imageUploadFailed({
            operation: "updateBand",
            supabaseMessage: uploadResult.error.message,
          });
        }

        payload.profile_image = supabase.storage
          .from(storageName)
          .getPublicUrl(uploadResult.data.path).data.publicUrl;
      } catch (error) {
        if (error instanceof CustomError) throw error;
        throw CustomError.imageUploadFailed({
          operation: "updateBand",
          originalError: error,
        });
      }
    }

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
