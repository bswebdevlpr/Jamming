"use client";

import HeroSection from "./sections/hero-section";
import FeaturesSection from "./sections/features-section";
import HowItWorksSection from "./sections/how-it-works";
import CTASection from "./sections/cta-section";
import PreviewSection from "./sections/preview-section";

export default function LandingPage() {
  return (
    <main className="overflow-without-scroll" style={{ height: "100%" }}>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CTASection />

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
                name: "Jamming",
                applicationCategory: "EntertainmentApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "KRW",
                },
                description:
                  "음악인을 위한 합주/잼 세션 매칭 플랫폼. 밴드 멤버 구하기, 합주 메이트 찾기, 전국 19개 지역 지원.",
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
                name: "Jamming",
                url: "https://jamming.co.kr",
                logo: "https://jamming.co.kr/logo.svg",
                sameAs: [],
              },
              {
                "@type": "WebSite",
                "@id": "https://jamming.co.kr/#website",
                url: "https://jamming.co.kr",
                name: "Jamming",
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
