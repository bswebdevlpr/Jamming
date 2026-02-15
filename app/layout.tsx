import "@/app/ui/global.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://jamming.co.kr"),
  title: {
    default: "JAMMING - 음악인을 위한 합주 플랫폼",
    template: "%s | JAMMING",
  },
  description:
    "놀기 위해 모였다! 전국 밴드 합주, 잼세션 모집 및 참여. 모든 뮤지션을 위한 합주 매칭 플랫폼.",
  keywords: [
    "합주",
    "잼세션",
    "밴드 모집",
    "밴드 합주",
    "음악",
    "기타",
    "베이스",
    "드럼",
    "보컬",
    "키보드",
    "락밴드",
    "인디밴드",
    "잼",
    "JAMMING",
    "Jam Session",
    "밴드 매칭",
    "음악 플랫폼",
  ],
  openGraph: {
    title: "JAMMING - 음악인을 위한 합주 플랫폼",
    description: "놀기 위해 모였다! 다양한 사람과 음악을 공유하고 즐기세요.",
    url: "https://jamming.co.kr",
    siteName: "JAMMING",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "JAMMING - 음악인을 위한 합주 플랫폼",
    description: "놀기 위해 모였다! 다양한 사람과 음악을 공유하고 즐기세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
  alternates: {
    canonical: "https://jamming.co.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <meta name="theme-color" content="#111113" />
        <link
          rel="preconnect"
          href="https://niiidqqsxsiowmzumcgw.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://niiidqqsxsiowmzumcgw.supabase.co"
        />
        {/* 폰트 CDN 최적화 */}
        <link rel="preconnect" href="https://fastly.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://fastly.jsdelivr.net" />
      </head>
      <body className={`antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "JAMMING",
              url: "https://jamming.co.kr",
              description: "음악인을 위한 합주 매칭 플랫폼",
              inLanguage: "ko",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "JAMMING",
              url: "https://jamming.co.kr",
              logo: "https://jamming.co.kr/og-image.png",
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
