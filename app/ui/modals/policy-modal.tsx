"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/app/ui/markdown/markdown-styles";

type PolicyType =
  | "서비스 이용약관"
  | "전자금융거래 이용약관"
  | "개인정보 수집/이용 동의"
  | "본인확인서비스 이용약관"
  | "마케팅 수신 이용 동의";

const POLICY_FILE_MAP: Record<PolicyType, string> = {
  "서비스 이용약관": "/policies/terms-of-service.md",
  "전자금융거래 이용약관": "/policies/financial-transaction.md",
  "개인정보 수집/이용 동의": "/policies/privacy-policy.md",
  "본인확인서비스 이용약관": "/policies/identity-verification.md",
  "마케팅 수신 이용 동의": "/policies/marketing.md",
};

interface PolicyModalProps {
  policyType: PolicyType;
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyModal({
  policyType,
  isOpen,
  onClose,
}: PolicyModalProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      const filePath = POLICY_FILE_MAP[policyType];
      setIsLoading(true);

      fetch(filePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("약관 파일을 불러올 수 없습니다.");
          }
          return response.text();
        })
        .then((text) => {
          setContent(text);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load policy:", error);
          setContent("약관 내용을 불러오는데 실패했습니다.");
          setIsLoading(false);
        });
    }
  }, [isOpen, policyType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: "min(90vw, 500px)",
          maxHeight: "80vh",
          backgroundColor: "var(--background)",
          borderRadius: "12px",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            style={{
              fontFamily: "SBAggroM",
              fontSize: "20px",
              color: "#E5E5E9",
            }}
          >
            {policyType}
          </h2>
          <button
            onClick={onClose}
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
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-scroll"
          style={{
            paddingRight: "8px",
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
    </div>
  );
}
