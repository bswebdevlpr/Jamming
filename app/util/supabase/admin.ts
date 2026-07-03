import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 서비스 롤(admin) Supabase 클라이언트.
 *
 * ⚠️ RLS 를 우회하므로 반드시 서버 사이드에서만, 세션으로 인가를 마친 뒤에만 사용한다.
 * SUPABASE_SERVICE_ROLE_KEY 는 서버 전용 비밀값이며 절대 클라이언트/NEXT_PUBLIC 로 노출하지 않는다.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (server-only) or NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
