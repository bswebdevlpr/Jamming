"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateBandDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
} from "@/app/lib/maps/jam";
import { IMAGE_UPLOAD } from "@/app/lib/constants/image";
import sharp from "sharp";

const MAX_LEADER_BANDS = 3;
const MAX_TOTAL_BANDS = 5;

export async function createBand(
  input: CreateBandDto
): Promise<ActionResult<Entity_Band>> {
  return safeAction("createBand", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드 리더 수 제한 체크 (최대 3개)
    const { count: leaderCount, error: leaderErr } = await supabase
      .from("band")
      .select("id", { count: "exact", head: true })
      .eq("leader_id", user.id);

    if (leaderErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        leaderErr,
        "createBand.checkLeaderLimit"
      );
    }
    if ((leaderCount ?? 0) >= MAX_LEADER_BANDS) {
      throw CustomError.bandLimitReached({
        operation: "createBand",
      });
    }

    // 총 밴드 참여 수 제한 체크 (최대 5개)
    const { count: totalCount, error: totalErr } = await supabase
      .from("band_member")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (totalErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        totalErr,
        "createBand.checkTotalLimit"
      );
    }
    if ((totalCount ?? 0) >= MAX_TOTAL_BANDS) {
      throw CustomError.bandLimitReached({
        operation: "createBand",
      });
    }

    // XSS 방지
    if (input.description) {
      input.description = await sanitize(input.description);
    }

    // 밴드 생성
    const { data: band, error: bandErr } = await supabase
      .from("band")
      .insert({
        leader_id: user.id,
        name: input.name,
        description: input.description,
        genre: input.genre.map((g) => MapGenreToData[g]),
        location: MapLocationToData[input.location],
        level: MapLevelToData[input.level],
        tags: input.tags ?? [],
      })
      .select()
      .single();

    if (bandErr || !band) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        bandErr ?? { message: "No data returned" },
        "createBand.insert"
      );
    }

    // 리더를 멤버로 자동 추가
    const { error: memberErr } = await supabase.from("band_member").insert({
      band_id: band.id,
      user_id: user.id,
      pos: input.genre[0] ? "기타" : "그 외", // 기본 포지션, 추후 수정 가능
      role: "leader",
      is_public: true,
    });

    if (memberErr) {
      // 멤버 추가 실패 시 밴드 삭제 (롤백)
      const { error: rollbackErr } = await supabase.from("band").delete().eq("id", band.id);
      if (rollbackErr) {
        console.error("[createBand] Rollback failed:", rollbackErr.message);
      }
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        memberErr,
        "createBand.addLeaderMember"
      );
    }

    // 프로필 이미지 업로드
    if (input.profile_image) {
      const file = input.profile_image;

      if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
        throw CustomError.validationFailed({ operation: "createBand" });
      }
      if (file.type && !file.type.startsWith("image/")) {
        throw CustomError.validationFailed({ operation: "createBand" });
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
          .upload(`band/${band.id}/profile-image/profile.webp`, optimized, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadResult.error) {
          throw CustomError.imageUploadFailed({
            operation: "createBand",
            supabaseMessage: uploadResult.error.message,
          });
        }

        const publicUrl = supabase.storage
          .from(storageName)
          .getPublicUrl(uploadResult.data.path).data.publicUrl;

        const { error: updateErr } = await supabase
          .from("band")
          .update({ profile_image: publicUrl })
          .eq("id", band.id);

        if (updateErr) {
          throw CustomError.fromSupabaseError(
            ErrorCode.UNEXPECTED,
            updateErr,
            "createBand.updateProfileImage"
          );
        }

        band.profile_image = publicUrl;
      } catch (error) {
        if (error instanceof CustomError) throw error;
        throw CustomError.imageUploadFailed({
          operation: "createBand",
          originalError: error,
        });
      }
    }

    return band;
  });
}
