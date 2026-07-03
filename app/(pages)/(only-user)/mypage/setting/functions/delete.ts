"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import { createAdminClient } from "@/app/util/supabase/admin";

export const destoryUser = async (): Promise<ActionResult<boolean>> => {
  return safeAction("destoryUser", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { error } = await supabase
      .from("user")
      .delete()
      .eq("id", user.id);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "destoryUser.deleteUser"
      );
    }

    // 인증(auth) 사용자 삭제는 service_role 권한이 필요하다.
    // anon 클라이언트로는 조용히 실패하므로 admin 클라이언트를 사용하고, 실패 시 명시적으로 throw.
    const admin = createAdminClient();
    const { error: authError } = await admin.auth.admin.deleteUser(user.id);
    if (authError) {
      throw CustomError.fromAuthError(
        ErrorCode.UNEXPECTED,
        authError,
        "destoryUser.deleteAuthUser"
      );
    }

    return true;
  });
};
