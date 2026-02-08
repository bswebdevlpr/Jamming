"use client";

import Image from "next/image";

type Provider = "kakao" | "google" | "email";

interface SocialLoginButtonProps {
  provider: Provider;
  onClick: () => void;
}

const config: Record<Provider, {
  label: string;
  bgColor: string;
  textColor: string;
  icon: string;
  border?: string;
}> = {
  kakao: {
    label: "카카오로 시작하기",
    bgColor: "#FEE500",
    textColor: "#191919",
    icon: "/signup/icons/kakao.svg",
  },
  google: {
    label: "Google로 시작하기",
    bgColor: "#FFFFFF",
    textColor: "#191919",
    icon: "/signup/icons/google.svg",
    border: "1px solid #dadce0",
  },
  email: {
    label: "이메일로 시작하기",
    bgColor: "#323234",
    textColor: "#FFFFFF",
    icon: "/signup/icons/email.svg",
  },
};

export default function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const { label, bgColor, textColor, icon, border } = config[provider];

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        width: "100%",
        height: "52px",
        borderRadius: "8px",
        fontFamily: "SUIT-BODY",
        fontSize: "15px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: border || "none",
      }}
    >
      <Image src={icon} alt={provider} width={20} height={20} />
      {label}
    </button>
  );
}
