"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

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
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1
                      style={{
                        fontFamily: "SBAggroM",
                        fontSize: "24px",
                        marginBottom: "16px",
                        marginTop: "24px",
                        color: "#A3FF0C",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        fontFamily: "SBAggroM",
                        fontSize: "18px",
                        marginBottom: "12px",
                        marginTop: "20px",
                        color: "#E5E5E9",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      style={{
                        fontFamily: "SUIT-BODY",
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        marginTop: "16px",
                        color: "#E5E5E9",
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p
                      style={{
                        marginBottom: "12px",
                        color: "#C0C0C5",
                      }}
                    >
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      style={{
                        marginBottom: "12px",
                        paddingLeft: "20px",
                        listStyleType: "disc",
                      }}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      style={{
                        marginBottom: "12px",
                        paddingLeft: "20px",
                        listStyleType: "decimal",
                      }}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      style={{
                        marginBottom: "8px",
                        color: "#C0C0C5",
                      }}
                    >
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong
                      style={{
                        fontWeight: "bold",
                        color: "#E5E5E9",
                      }}
                    >
                      {children}
                    </strong>
                  ),
                  table: ({ children }) => (
                    <table
                      style={{
                        width: "100%",
                        marginBottom: "16px",
                        borderCollapse: "collapse",
                      }}
                    >
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead
                      style={{
                        backgroundColor: "#444447",
                      }}
                    >
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th
                      style={{
                        padding: "8px",
                        border: "1px solid #666669",
                        textAlign: "left",
                        fontWeight: "bold",
                        color: "#E5E5E9",
                      }}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #666669",
                        color: "#C0C0C5",
                      }}
                    >
                      {children}
                    </td>
                  ),
                  hr: () => (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid #444447",
                        margin: "16px 0",
                      }}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
