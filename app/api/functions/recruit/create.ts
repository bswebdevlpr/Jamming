"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateRecruitPostDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";
import { Entity_RecruitPost } from "@/app/lib/interfaces/entity.interface";

export async function createRecruitPost(
  input: CreateRecruitPostDto
): Promise<ActionResult<Entity_RecruitPost>> {
  return safeAction("createRecruitPost", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드장 권한 확인 및 밴드 설정 조회
    const { data: band, error: bandErr } = await supabase
      .from("band")
      .select("id, leader_id, genre, location, level")
      .eq("id", input.band_id)
      .single();

    if (bandErr || !band) {
      throw CustomError.invalidBand({ operation: "createRecruitPost" });
    }
    if (band.leader_id !== user.id) {
      throw CustomError.notBandLeader({ operation: "createRecruitPost" });
    }

    // 활성 구인글 중복 체크 (밴드당 1개)
    const { count: activeCount, error: activeErr } = await supabase
      .from("recruit_post")
      .select("id", { count: "exact", head: true })
      .eq("band_id", input.band_id)
      .eq("is_active", true);

    if (activeErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        activeErr,
        "createRecruitPost.checkActive"
      );
    }
    if ((activeCount ?? 0) > 0) {
      throw CustomError.validationFailed({
        operation: "createRecruitPost: band already has an active recruit post",
      });
    }

    // XSS 방지
    input.body = await sanitize(input.body);

    // deadline이 과거 날짜인지 체크
    if (input.deadline) {
      const deadline = new Date(input.deadline);
      if (deadline < new Date()) {
        throw CustomError.validationFailed({
          operation: "createRecruitPost: deadline is in the past",
        });
      }
    }

    // 구인글 생성 (밴드 설정 자동 반영)
    const { data: post, error: postErr} = await supabase
      .from("recruit_post")
      .insert({
        band_id: input.band_id,
        user_id: user.id,
        title: input.title,
        body: input.body,
        positions: input.positions,
        genre: band.genre,
        level: band.level,
        location: band.location,
        songs: input.songs ?? [],
        images: input.images ?? [],
        video_url: input.video_url || null,
        openchat: input.openchat || null,
        deadline: input.deadline || null,
      })
      .select()
      .single();

    if (postErr || !post) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        postErr ?? { message: "No data returned" },
        "createRecruitPost.insert"
      );
    }

    return post;
  });
}
