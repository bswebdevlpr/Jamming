"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

const supabase = await createClient();
const isDev = process.env.NODE_ENV === "development";

export async function signInWithKakao() {
  console.log("from callback", await supabase.from("user").select());
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: "kakao",
  //     options: {
  //       redirectTo: "http://localhost:3000/api/auth/callback",
  //     },
  //   });

  //   if (data.url) redirect(data.url);
  //   if (error) {
  //     console.error("Failed to sign in");
  //     if (isDev) console.error(error);
  //   }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  } catch (e) {
    console.error("Failed to sign out");
    if (isDev) console.error(e);
  }
}

export async function getUser() {
  let user = null;

  try {
    user = await supabase.auth.getUser();
  } catch (e) {
    console.error("Failed to get user");
    if (isDev) console.error(e);
  }

  return user;
}

export async function getSession() {
  let session = null;

  try {
    session = await supabase.auth.getSession();
  } catch (e) {
    console.error("Failed to get session");
    if (isDev) console.error(e);
  }

  return session;
}
