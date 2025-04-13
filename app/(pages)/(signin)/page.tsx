"use client";

import Image from "next/image";
import { useEffect } from "react";
import { signInWithKakao } from "@/app/util/supabase/auth";
import { createClient } from "@/app/util/supabase/client";

export default function SignIn() {
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      //   if (session.status === "loading") setIsLoading(true);
      //   else if (
      //     session.data?.user?.isRegistered &&
      //     session.status === "authenticated"
      //   ) {
      //     setIsLoading(false);
      //     redirect("/jamsession");
      //   } else setIsLoading(false);
    };
    fetchSession();
  }, []);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
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
      <Image
        src="/signup/large-wide.png"
        alt="kakao login"
        width={350}
        height={52}
        onClick={signInWithKakao}
      />
    </div>
  );
}
