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
            "@type": "SoftwareApplication",
            name: "Jamming",
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
            description:
              "음악인을 위한 합주/잼 세션 매칭 플랫폼. 밴드 멤버 구하기, 합주 메이트 찾기.",
            url: "https://jamming.co.kr",
          }),
        }}
      />
    </main>
  );
}
