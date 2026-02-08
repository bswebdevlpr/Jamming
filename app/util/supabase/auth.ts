"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

const isDev = process.env.NODE_ENV === "development";

export async function signInWithKakao() {
  // AHA!
  // 재로그인의 경우 createClient()를 다시 해줘야함
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${process.env.DOMAIN}/api/auth/callback`,
    },
  });

  if (data.url) redirect(data.url);
  if (error) {
    if (isDev) console.error(error);
    redirect("/signin");
  }
}
