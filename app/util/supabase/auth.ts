"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

let supabase = await createClient();
const isDev = process.env.NODE_ENV === "development";

export async function signInWithKakao() {
  // AHA!
  // 재로그인의 경우 createClient()를 다시 해줘야함
  supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: "http://localhost:3000/api/auth/callback",
    },
  });

  if (data.url) redirect(data.url);
  if (error) {
    await supabase.auth.initialize();
    console.error("Failed to sign in");
    if (isDev) console.error(error);
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
}

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Failed to get user");
    if (isDev) console.error(error);
  }

  return user;
}

export async function getSession() {
  await supabase.auth.getUser();

  return await supabase.auth.getSession();
}
