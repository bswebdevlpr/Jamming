import Link from "next/link";

export default function OAuthPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "var(--background)",
          borderBottom: "1px solid var(--border)",
          zIndex: 10,
        }}
      >
        {/* 로고 */}
        <span
          style={{
            fontFamily: "SBAggroM",
            fontSize: "24px",
            color: "var(--highlight)",
          }}
        >
          JAMMING
        </span>

        {/* 개인정보처리방침 링크 - 극대화 */}
        <Link
          href="https://jamming.co.kr/privacy-policy"
          aria-label="Privacy Policy"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem", // 16px - 크게
            color: "#E5E5E9", // 밝은색
            fontWeight: "600", // Semi-bold - 굵게
            textDecoration: "none",
          }}
        >
          개인정보처리방침
        </Link>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        {/* 로고 이미지 (선택적) */}
        {/* <img
          src="/logo.svg"
          alt="JAMMING 로고"
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "24px",
          }}
        /> */}

        {/* H1: 순수 앱 이름만, 초대형 */}
        <h1
          style={{
            fontFamily: "SBAggroM",
            fontSize: "64px", // 초대형
            color: "var(--highlight)",
            letterSpacing: "0",
            lineHeight: "140%",
            margin: "0 0 24px 0",
          }}
        >
          JAMMING
        </h1>

        {/* 명시적 앱 설명 */}
        <p
          aria-label="JAMMING is a jam session matching platform for musicians."
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "20px", // 크게
            color: "var(--foreground)",
            letterSpacing: "-0.025em",
            lineHeight: "150%",
            margin: "0 0 16px 0",
            maxWidth: "600px",
          }}
        >
          JAMMING은 음악인을 위한 합주 매칭 플랫폼입니다.
        </p>

        {/* 상세 설명 */}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "16px",
            color: "#9F9FA2",
            letterSpacing: "-0.025em",
            lineHeight: "160%",
            margin: "0 0 40px 0",
            maxWidth: "600px",
          }}
        >
          지역·장르·레벨별로 딱 맞는 합주 파트너를 찾고,
          <br />
          밴드를 관리하고, 음악인 커뮤니티를 만드세요.
        </p>

        {/* 주요 기능 */}
        <div
          style={{
            background: "#1A1A1D",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "24px 32px",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h2
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "18px",
              color: "var(--foreground)",
              margin: "0 0 16px 0",
            }}
          >
            주요 기능
          </h2>
          <ul
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "15px",
              color: "#E5E5E9",
              lineHeight: "180%",
              margin: 0,
              padding: "0 0 0 20px",
              textAlign: "left",
            }}
          >
            <li>잼 세션 매칭 - 실시간으로 세션 찾기</li>
            <li>밴드 관리 - 멤버 초대 및 일정 공유</li>
            <li>구인 게시판 - 포지션별 멤버 구하기</li>
            <li>전국 19개 지역 지원</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* 링크들 - 극대화 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="https://jamming.co.kr/privacy-policy"
            aria-label="Privacy Policy"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem", // 16px - 크게
              color: "#E5E5E9", // 밝은색
              fontWeight: "600", // Semi-bold - 굵게
              textDecoration: "none",
            }}
          >
            개인정보처리방침
          </Link>
          <span style={{ color: "#666669" }}>•</span>
          <Link
            href="/terms-of-service"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#E5E5E9",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            서비스 이용약관
          </Link>
        </div>

        {/* 저작권 */}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#666669",
            margin: 0,
          }}
        >
          © 2026 JAMMING. All rights reserved.
        </p>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "@id": "https://jamming.co.kr/#software",
                name: "JAMMING",
                applicationCategory: "EntertainmentApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "KRW",
                },
                description:
                  "JAMMING은 음악인을 위한 합주 매칭 플랫폼입니다. 밴드 멤버 구하기, 잼 세션 모집 및 참여, 전국 19개 지역 지원. 장르·포지션·레벨별 매칭으로 아마추어부터 프로까지 모든 음악인이 쉽게 합주 파트너를 찾고 음악 커뮤니티를 만들 수 있습니다.",
                url: "https://jamming.co.kr",
                featureList: [
                  "잼 세션 매칭",
                  "밴드 관리",
                  "구인 게시판",
                  "전국 지역 지원",
                ],
                screenshot: "https://jamming.co.kr/og-image.png",
              },
              {
                "@type": "Organization",
                "@id": "https://jamming.co.kr/#organization",
                name: "JAMMING",
                url: "https://jamming.co.kr",
                logo: "https://jamming.co.kr/logo.svg",
                sameAs: [],
              },
              {
                "@type": "WebSite",
                "@id": "https://jamming.co.kr/#website",
                url: "https://jamming.co.kr",
                name: "JAMMING",
                description: "JAMMING은 음악인을 위한 합주 매칭 플랫폼입니다.",
                privacyPolicy: "https://jamming.co.kr/privacy-policy",
                publisher: {
                  "@id": "https://jamming.co.kr/#organization",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
