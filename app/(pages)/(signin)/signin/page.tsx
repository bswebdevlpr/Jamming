"use client";

import { signInWithGoogle, signInWithKakao } from "@/app/util/supabase/auth";
import { createClient } from "@/app/util/supabase/client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SocialLoginButton from "./social-login-button";

export default function SignIn() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const redirect = searchParams.get("redirect");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    };
    checkSession();

    // OAuth 에러 처리
    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
      oauth_failed: "로그인에 실패했습니다. 다시 시도해주세요.",
      rate_limit: "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.",
      auth_code_error: "인증 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
      org_restricted:
        "해당 Google 계정은 조직 내부 전용입니다. 개인 Google 계정으로 시도해주세요.",
    };

    if (error && errorMessages[error]) {
      setErrorMessage(errorMessages[error]);
    }
  }, [searchParams]);

  if (isChecking) return null;

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div
        style={{
          height: "11.42%",
        }}
      ></div>{" "}
      {/* 빈칸 */}
      <div className="grow flex flex-col items-center">
        <div className="relative">
          <Image
            className="shrink-0 absolute"
            style={{
              transform: "translate(144.4px, 42.05px)",
            }}
            src="/love.svg"
            alt="love-right"
            width={36.46}
            height={43.02}
          />
          <Image
            className="shrink-0 absolute"
            style={{
              transform: "translate(-30px, 120px) rotate(-60deg)",
            }}
            src="/love.svg"
            alt="love-left"
            width={24.09}
            height={28.71}
          />
          <Image
            className="mb-14"
            src="/logo.svg"
            alt="Logo"
            width={149}
            height={138}
          />
        </div>
        <p
          style={{
            fontFamily: "SBAggroM",
            color: "#A3FF0C",
            fontSize: "50px",
          }}
          className=""
        >
          JAMMING
        </p>
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "24px",
          }}
          className=""
        >
          놀기 위해 모였다!
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "14px",
            color: "#C0C0C5",
          }}
        >
          음악인을 위한 합주 플랫폼
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full px-4 pb-8">
        {errorMessage && (
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "14px",
              color: "#FF3E2F",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {errorMessage}
          </p>
        )}
        <SocialLoginButton
          provider="kakao"
          onClick={() => signInWithKakao(redirect || undefined)}
        />
        <SocialLoginButton
          provider="google"
          onClick={() => signInWithGoogle(redirect || undefined)}
        />
        <SocialLoginButton
          provider="email"
          onClick={() => router.push("/email")}
        />
      </div>
    </div>
  );
}
