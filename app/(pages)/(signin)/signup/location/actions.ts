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
import { FormData_User, ZodSchema_User } from "@/app/lib/zod";
import { sanitize } from "@/app/lib/functions/validate";

type CreateUserInput = FormData_User & { profile_image?: File };

export default async function createUser(
  input: CreateUserInput
): Promise<ActionResult<UserProfile>> {
  return safeAction("createUser", async () => {
    // 서버 측 Zod 검증
    const validated = ZodSchema_User.parse(input);

    const supabase = await createClient();
    const user = await getUser(supabase);

    // 파일 업로드 검증
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    if (input.profile_image) {
      if (input.profile_image.size > MAX_FILE_SIZE) {
        throw CustomError.validationFailed({
          operation: "createUser",
        });
      }
      if (!ALLOWED_TYPES.includes(input.profile_image.type)) {
        throw CustomError.validationFailed({
          operation: "createUser",
        });
      }
    }

    // 사용자 입력 sanitize (XSS 방지)
    const sanitizedNickname = await sanitize(validated.nickname);
    const sanitizedTags = await Promise.all(
      validated.tags.map((tag) => sanitize(tag))
    );

    let profile_image: string | undefined = undefined;

    if (input.profile_image) {
      try {
        const uploadResult = await supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME!)
          .upload(
            `user/${user.id}/profile-image/${input.profile_image.name}`,
            input.profile_image
          );

        if (uploadResult.error) {
          throw CustomError.imageUploadFailed({
            operation: "createUser",
            supabaseMessage: uploadResult.error.message,
          });
        }

        profile_image = supabase.storage
          .from(process.env.SUPABASE_STORAGE_NAME!)
          .getPublicUrl(uploadResult.data.path).data.publicUrl;
      } catch (error) {
        if (error instanceof CustomError) throw error;
        throw CustomError.imageUploadFailed({
          operation: "createUser",
          originalError: error,
        });
      }
    }

    // 허용된 필드만 명시적으로 추출 (Mass Assignment 방지)
    const { data, error } = await supabase
      .from("user")
      .insert({
        nickname: sanitizedNickname,
        tags: sanitizedTags,
        pos: MapPositionToData[validated.pos],
        genre: MapGenreToData[validated.genre],
        level: MapLevelToData[validated.level],
        location: MapLocationToData[validated.location!],
        accept_marketing: validated.accept_marketing,
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
