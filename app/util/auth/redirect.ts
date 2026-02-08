import { createClient } from "@/app/util/supabase/client";

export async function getAuthRedirectPath(userId: string): Promise<string> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("user")
    .select()
    .eq("id", userId)
    .single();

  return profile ? "/" : "/signup";
}
