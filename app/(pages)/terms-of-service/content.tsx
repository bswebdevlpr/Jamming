"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/app/ui/markdown/markdown-styles";

export default function TermsOfServiceContent() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const filePath = "/policies/terms-of-service.md";
    setIsLoading(true);

    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("서비스 이용약관 파일을 불러올 수 없습니다.");
        }
        return response.text();
      })
      .then((text) => {
        setContent(text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load terms of service:", error);
        setContent("서비스 이용약관 내용을 불러오는데 실패했습니다.");
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100vh",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "16px 20px",
          borderBottom: "1px solid #444447",
          position: "sticky",
          top: 0,
          backgroundColor: "var(--background)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#444447",
            border: "none",
            cursor: "pointer",
            color: "#E5E5E9",
            fontSize: "20px",
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontFamily: "SBAggroM",
            fontSize: "20px",
            color: "#E5E5E9",
            margin: 0,
          }}
        >
          서비스 이용약관
        </h1>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-scroll"
        style={{
          padding: "24px 20px",
        }}
      >
        {isLoading ? (
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "14px",
              color: "#C0C0C5",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            로딩 중...
          </p>
        ) : (
          <div
            className="markdown-content"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "14px",
              color: "#E5E5E9",
              lineHeight: "1.6",
            }}
          >
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
