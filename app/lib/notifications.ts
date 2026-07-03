import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

/**
 * 알림 생성 (서버 내부 전용 헬퍼).
 *
 * 임의의 user_id 로 알림을 작성하므로, 클라이언트가 직접 호출할 수 없도록
 * Server Action("use server")이 아닌 일반 서버 모듈로 둔다.
 * 반드시 다른 신뢰된 서버 액션(create/comment 등) 내부에서만 호출할 것.
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string,
  data?: Record<string, any>
): Promise<ActionResult<boolean>> {
  return safeAction("createNotification", async () => {
    const supabase = await createClient();

    const { error } = await supabase.from("notification").insert({
      user_id: userId,
      type,
      title,
      body,
      data: data ?? {},
    });

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "createNotification"
      );
    }

    return true;
  });
}
