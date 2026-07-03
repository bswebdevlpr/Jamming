"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";
import {
  emailAuthLimiter,
  oauthLimiter,
  getClientIPFromHeaders,
} from "@/app/lib/rate-limit";
import { CustomError } from "@/app/lib/errors/custom-error";

const isDev = process.env.NODE_ENV === "development";

async function signInWithOAuthProvider(
  provider: "kakao" | "google",
  redirectPath?: string
) {
  // Rate limiting: OAuth 남용 방지 (프로바이더 + 클라이언트 IP 기준)
  const ip = await getClientIPFromHeaders();
  const identifier = `oauth:${provider}:${ip}`;
  const { success } = await oauthLimiter.limit(identifier);

  if (!success) {
    redirect("/signin?error=rate_limit");
  }

  // AHA!
  // 재로그인의 경우 createClient()를 다시 해줘야함
  const supabase = await createClient();

  // redirectPath를 콜백 URL에 포함
  const callbackUrl = new URL(`${process.env.DOMAIN}/api/auth/callback`);
  if (redirectPath) {
    callbackUrl.searchParams.set("redirect", redirectPath);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (data.url) redirect(data.url);
  if (error) {
    if (isDev) console.error(error);
    redirect("/signin?error=oauth_failed");
  }
}

export async function signInWithKakao(redirectPath?: string) {
  return signInWithOAuthProvider("kakao", redirectPath);
}

export async function signInWithGoogle(redirectPath?: string) {
  return signInWithOAuthProvider("google", redirectPath);
}

/**
 * 이메일 로그인 (Server Action)
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    // Rate limiting: 이메일 기반 (같은 이메일로 반복 로그인 시도 방지)
    const identifier = `email-signin:${email}`;
    const { success } = await emailAuthLimiter.limit(identifier);

    if (!success) {
      throw CustomError.rateLimitExceeded({ operation: "signInWithEmail" });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { success: true as const, data };
  } catch (error: any) {
    if (error instanceof CustomError) {
      return { success: false as const, error: error.toClientSafe() };
    }
    // 원문 에러는 서버에서만 로깅, 클라이언트에는 일반 메시지 (계정 존재 탐지 방지)
    if (isDev) console.error("[signInWithEmail]", error);
    return {
      success: false as const,
      error: {
        code: "AUTH_ERROR",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      },
    };
  }
}

/**
 * 이메일 회원가입 (Server Action)
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  accept_marketing: boolean
) {
  try {
    // Rate limiting: 이메일 기반 (같은 이메일로 반복 가입 시도 방지)
    const identifier = `email-signup:${email}`;
    const { success } = await emailAuthLimiter.limit(identifier);

    if (!success) {
      throw CustomError.rateLimitExceeded({ operation: "signUpWithEmail" });
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.DOMAIN}/api/auth/callback`,
        data: {
          accept_marketing,
        },
      },
    });

    if (error) {
      throw error;
    }

    return { success: true as const };
  } catch (error: any) {
    if (error instanceof CustomError) {
      return { success: false as const, error: error.toClientSafe() };
    }
    // 원문 에러는 서버에서만 로깅, 클라이언트에는 일반 메시지
    if (isDev) console.error("[signUpWithEmail]", error);
    return {
      success: false as const,
      error: {
        code: "AUTH_ERROR",
        message: "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.",
      },
    };
  }
}
