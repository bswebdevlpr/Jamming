"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LeftArrowWhite } from "@/app/ui/images/arrows";

interface LandingHeaderProps {
  showBackButton?: boolean;
}

export default function LandingHeader({ showBackButton = false }: LandingHeaderProps) {
  const router = useRouter();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        zIndex: 10,
      }}
    >
      {/* 로고 & 앱 이름 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {showBackButton && (
          <div
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(17, 17, 19, 0.7)",
              cursor: "pointer",
            }}
            onClick={() => router.back()}
          >
            <LeftArrowWhite />
          </div>
        )}
        <span
          style={{
            fontFamily: "SBAggroM",
            fontSize: "20px",
            color: "var(--highlight)",
          }}
        >
          JAMMING
        </span>
      </div>

      {/* 링크 */}
      <nav style={{ display: "flex", gap: "16px" }}>
        <Link
          href="/privacy-policy"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#E5E5E9",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          개인정보처리방침
        </Link>
        <Link
          href="/terms-of-service"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#E5E5E9",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          서비스 이용약관
        </Link>
      </nav>
    </header>
  );
}
