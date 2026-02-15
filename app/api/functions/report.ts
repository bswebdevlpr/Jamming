"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "./read";
import { CreateReportDto } from "../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function createReport(
  input: CreateReportDto
): Promise<ActionResult<boolean>> {
  return safeAction("createReport", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // 1. 게시글 존재 확인
    const { data: jam, error: jamErr } = await supabase
      .from("jamsession")
      .select("id, user_id")
      .eq("id", input.jam_id)
      .single();

    if (jamErr || !jam) {
      throw CustomError.invalidJam({ operation: "createReport" });
    }

    // 2. 자기 게시글 신고 방지
    if (jam.user_id === user.id) {
      throw CustomError.forbidden({
        operation: "createReport: cannot report own post",
      });
    }

    // 3. 중복 신고 확인
    const { data: existing } = await supabase
      .from("report")
      .select("id")
      .eq("jam_id", input.jam_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      throw CustomError.alreadyReported({ operation: "createReport" });
    }

    // 4. XSS 방지
    input.body = await sanitize(input.body);

    // 5. 신고 생성
    const { error } = await supabase.from("report").insert({
      jam_id: input.jam_id,
      user_id: user.id,
      type: input.type,
      body: input.body,
    });

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "createReport.insert"
      );
    }

    return true;
  });
}
