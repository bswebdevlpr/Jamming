"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { sanitize } from "@/app/lib/functions/validate";
import { ZodSchema_User } from "@/app/lib/zod";
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
import sharp from "sharp";

export interface UpdateProfileInput {
  location?: LocationEnum;
  pos?: PositionEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  is_bpm_public?: boolean;
  nickname?: string;
  profile_image?: File;
}

export interface UpdateProfileResult {
  profile_image?: string;
}

export const updateProfile = async (
  input: UpdateProfileInput
): Promise<ActionResult<UpdateProfileResult>> => {
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
    if (input.nickname !== undefined) {
      // E2: 서버 측 Zod 형식 검증
      const parseResult = ZodSchema_User.shape.nickname.safeParse(input.nickname);
      if (!parseResult.success) {
        throw CustomError.validationFailed({ operation: "updateProfile" });
      }

      // E3: 현재 닉네임과 다른 경우에만 중복 검사
      const { data: currentUser } = await supabase
        .from("user")
        .select("nickname")
        .eq("id", user.id)
        .single();

      if (currentUser?.nickname !== input.nickname) {
        const { data: existing } = await supabase
          .from("user_nickname")
          .select()
          .eq("nickname", input.nickname)
          .limit(1);

        if (existing && existing.length > 0) {
          throw CustomError.validationFailed({ operation: "updateProfile" });
        }
      }

      payload.nickname = await sanitize(input.nickname);
    }

    // W4: 빈 payload 방어
    if (Object.keys(payload).length === 0 && !input.profile_image) {
      return {};
    }

    let profile_image: string | undefined = undefined;

    if (input.profile_image) {
      // E1: 서버 측 파일 타입/크기 검증
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

      if (input.profile_image.size > MAX_FILE_SIZE) {
        throw CustomError.validationFailed({ operation: "updateProfile" });
      }
      if (!ALLOWED_TYPES.includes(input.profile_image.type)) {
        throw CustomError.validationFailed({ operation: "updateProfile" });
      }

      const storageName = process.env.SUPABASE_STORAGE_NAME;
      if (!storageName) throw new Error("SUPABASE_STORAGE_NAME is not defined");

      try {
        const buffer = Buffer.from(await input.profile_image.arrayBuffer());
        const optimized = await sharp(buffer)
          .resize(500, 500, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        const uploadResult = await supabase.storage
          .from(storageName)
          .upload(`user/${user.id}/profile-image/profile.webp`, optimized, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadResult.error) {
          throw CustomError.imageUploadFailed({
            operation: "updateProfile",
            supabaseMessage: uploadResult.error.message,
          });
        }

        profile_image = supabase.storage
          .from(storageName)
          .getPublicUrl(uploadResult.data.path).data.publicUrl;

        payload.profile_image = profile_image;
      } catch (error) {
        if (error instanceof CustomError) throw error;
        throw CustomError.imageUploadFailed({
          operation: "updateProfile",
          originalError: error,
        });
      }
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

    return { profile_image };
  });
};
