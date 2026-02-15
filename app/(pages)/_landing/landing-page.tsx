"use client";

import CTASection from "./sections/cta-section";
import FeaturesSection from "./sections/features-section";
import LandingHeader from "./sections/header-section";
import HeroSection from "./sections/hero-section";
import HowItWorksSection from "./sections/how-it-works";
import PreviewSection from "./sections/preview-section";

interface LandingPageProps {
  hideLoginButton?: boolean;
}

export default function LandingPage({
  hideLoginButton = false,
}: LandingPageProps) {
  return (
    <main className="overflow-without-scroll" style={{ height: "100%" }}>
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CTASection hideButton={hideLoginButton} />

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
                  "음악인을 위한 합주 매칭 플랫폼. 밴드 멤버 구하기, 잼 세션 모집 및 참여, 전국 19개 지역 지원. 장르·포지션·레벨별 매칭으로 아마추어부터 프로까지 모든 음악인이 쉽게 합주 파트너를 찾고 음악 커뮤니티를 만들 수 있습니다.",
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
                description: "음악인을 위한 합주 매칭 플랫폼",
                publisher: {
                  "@id": "https://jamming.co.kr/#organization",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
