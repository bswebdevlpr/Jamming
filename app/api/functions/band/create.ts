"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateBandDto } from "../../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";

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
        genre: input.genre,
        location: input.location,
        level: input.level,
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
      await supabase.from("band").delete().eq("id", band.id);
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        memberErr,
        "createBand.addLeaderMember"
      );
    }

    return band;
  });
}
