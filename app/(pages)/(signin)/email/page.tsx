"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/util/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import { getAuthRedirectPath } from "@/app/util/auth/redirect";
import { z } from "zod";

// 이메일/비밀번호 Zod 스키마
const emailSchema = z.string().email("올바른 이메일 형식이 아닙니다.");
const passwordSchema = z
  .string()
  .min(6, "비밀번호는 최소 6자 이상이어야 합니다.");

const getErrorMessage = (error: AuthError) => {
  const msg = error.message.toLowerCase();
  if (msg.includes("invalid") || msg.includes("credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (msg.includes("not confirmed") || msg.includes("email")) {
    return "이메일 인증이 완료되지 않았습니다.";
  }
  if (msg.includes("already registered") || msg.includes("already exists")) {
    return "이미 가입된 이메일입니다.";
  }
  return "오류가 발생했습니다. 다시 시도해주세요.";
};

export default function EmailAuth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 회원가입 성공 후 3초 뒤 자동 탭 전환 (cleanup 포함)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setMode("signin");
        setSuccess("");
        setEmail("");
        setPassword("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Zod 유효성 검사
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "signin") {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(getErrorMessage(error));
          setIsLoading(false);
          return;
        }

        // 프로필 존재 확인 및 리다이렉트
        const redirectPath = await getAuthRedirectPath(data.user.id);
        setIsLoading(false);
        router.push(redirectPath);
      } else {
        // 회원가입
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN || window.location.origin}/api/auth/callback`,
          },
        });

        if (error) {
          setError(getErrorMessage(error));
          setIsLoading(false);
          return;
        }

        setSuccess("확인 이메일을 보냈습니다. 이메일을 확인해주세요.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  const isFormValid =
    email && password && (mode === "signin" || password.length >= 6);

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#111113" }}>
      {/* 뒤로가기 버튼 */}
      <div className="px-4 pt-4 pb-6">
        <LeftArrowWhite
          onClick={() => router.push("/signin")}
          width={24}
          height={24}
        />
      </div>

      {/* 탭 */}
      <div className="flex px-4 mb-8">
        <button
          onClick={() => switchMode("signin")}
          style={{
            flex: 1,
            paddingBottom: "12px",
            fontFamily: "SUIT-BODY",
            fontSize: "18px",
            color: mode === "signin" ? "#FFFFFF" : "#535355",
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
            borderBottom:
              mode === "signin"
                ? "2px solid #A3FF0C"
                : "2px solid #323234",
          }}
        >
          로그인
        </button>
        <button
          onClick={() => switchMode("signup")}
          style={{
            flex: 1,
            paddingBottom: "12px",
            fontFamily: "SUIT-BODY",
            fontSize: "18px",
            color: mode === "signup" ? "#FFFFFF" : "#535355",
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
            borderBottom:
              mode === "signup"
                ? "2px solid #A3FF0C"
                : "2px solid #323234",
          }}
        >
          회원가입
        </button>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 px-4">
          <div className="flex flex-col gap-6">
            {/* 이메일 입력 */}
            <div>
              <label
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "14px",
                  color: "#C0C0C5",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#323234",
                  border: "1px solid #535355",
                  color: "#FFFFFF",
                  fontFamily: "SUIT-BODY",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "14px",
                  color: "#C0C0C5",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "최소 6자 이상" : "비밀번호 입력"}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#323234",
                  border: "1px solid #535355",
                  color: "#FFFFFF",
                  fontFamily: "SUIT-BODY",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "14px",
                  color: "#FF3E2F",
                  marginTop: "-8px",
                }}
              >
                {error}
              </p>
            )}

            {/* 성공 메시지 */}
            {success && (
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "14px",
                  color: "#A3FF0C",
                  marginTop: "-8px",
                }}
              >
                {success}
              </p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="px-4 pb-8">
          <ButtonTemplate
            text={isLoading ? "처리 중..." : "시작하기"}
            onClick={handleSubmit}
            isActive={!!isFormValid && !isLoading}
          />
        </div>
      </form>
    </div>
  );
}
