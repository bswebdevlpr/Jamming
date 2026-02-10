"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { CreateBandMemberDto } from "../../dtos/create";

const MAX_MEMBERS_PER_BAND = 10;
const MAX_TOTAL_BANDS = 5;

export async function addBandMember(
  input: CreateBandMemberDto
): Promise<ActionResult<boolean>> {
  return safeAction("addBandMember", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드장 권한 확인
    const { data: band, error: bandErr } = await supabase
      .from("band")
      .select("id, leader_id")
      .eq("id", input.band_id)
      .single();

    if (bandErr || !band) {
      throw CustomError.invalidBand({ operation: "addBandMember" });
    }
    if (band.leader_id !== user.id) {
      throw CustomError.notBandLeader({ operation: "addBandMember" });
    }

    // 멤버 수 제한 체크 (최대 10명)
    const { count: memberCount, error: countErr } = await supabase
      .from("band_member")
      .select("id", { count: "exact", head: true })
      .eq("band_id", input.band_id);

    if (countErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        countErr,
        "addBandMember.checkMemberLimit"
      );
    }
    if ((memberCount ?? 0) >= MAX_MEMBERS_PER_BAND) {
      throw CustomError.memberLimitReached({ operation: "addBandMember" });
    }

    // 중복 가입 체크
    const { data: existing } = await supabase
      .from("band_member")
      .select("id")
      .eq("band_id", input.band_id)
      .eq("user_id", input.user_id)
      .maybeSingle();

    if (existing) {
      throw CustomError.alreadyMember({ operation: "addBandMember" });
    }

    // 대상 유저의 총 밴드 참여 수 제한 체크 (최대 5개)
    const { count: userBandCount, error: userErr } = await supabase
      .from("band_member")
      .select("id", { count: "exact", head: true })
      .eq("user_id", input.user_id);

    if (userErr) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        userErr,
        "addBandMember.checkUserLimit"
      );
    }
    if ((userBandCount ?? 0) >= MAX_TOTAL_BANDS) {
      throw CustomError.bandLimitReached({ operation: "addBandMember" });
    }

    // 멤버 추가
    const { error } = await supabase.from("band_member").insert({
      band_id: input.band_id,
      user_id: input.user_id,
      pos: input.pos,
      role: input.role,
      is_public: input.is_public ?? true,
    });

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "addBandMember.insert"
      );
    }

    return true;
  });
}

export async function removeBandMember(
  bandId: number,
  memberId: number
): Promise<ActionResult<boolean>> {
  return safeAction("removeBandMember", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드장 권한 확인
    const { data: band, error: bandErr } = await supabase
      .from("band")
      .select("id, leader_id")
      .eq("id", bandId)
      .single();

    if (bandErr || !band) {
      throw CustomError.invalidBand({ operation: "removeBandMember" });
    }
    if (band.leader_id !== user.id) {
      throw CustomError.notBandLeader({ operation: "removeBandMember" });
    }

    // 밴드장 본인은 추방 불가
    const { data: member } = await supabase
      .from("band_member")
      .select("id, user_id, role")
      .eq("id", memberId)
      .single();

    if (member?.role === "leader") {
      throw CustomError.forbidden({
        operation: "removeBandMember: cannot remove leader",
      });
    }

    const { error } = await supabase
      .from("band_member")
      .delete()
      .eq("id", memberId)
      .eq("band_id", bandId);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "removeBandMember"
      );
    }

    return true;
  });
}

export async function leaveBand(
  bandId: number
): Promise<ActionResult<boolean>> {
  return safeAction("leaveBand", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 밴드장은 탈퇴 불가 (밴드 삭제로 유도)
    const { data: band } = await supabase
      .from("band")
      .select("leader_id")
      .eq("id", bandId)
      .single();

    if (band?.leader_id === user.id) {
      throw CustomError.forbidden({
        operation: "leaveBand: leader cannot leave, delete band instead",
      });
    }

    const { error } = await supabase
      .from("band_member")
      .delete()
      .eq("band_id", bandId)
      .eq("user_id", user.id);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "leaveBand"
      );
    }

    return true;
  });
}
