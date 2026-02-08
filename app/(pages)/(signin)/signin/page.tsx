"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signInWithKakao, signInWithGoogle } from "@/app/util/supabase/auth";
import { createClient } from "@/app/util/supabase/client";
import { useRouter } from "next/navigation";
import SocialLoginButton from "./social-login-button";

export default function SignIn() {
  const supabase = createClient();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

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
  }, []);

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
        <SocialLoginButton provider="kakao" onClick={signInWithKakao} />
        <SocialLoginButton provider="google" onClick={signInWithGoogle} />
        <SocialLoginButton
          provider="email"
          onClick={() => router.push("/email")}
        />
      </div>
    </div>
  );
}
