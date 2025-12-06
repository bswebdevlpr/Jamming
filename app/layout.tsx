import type { Metadata } from "next";
import "@/app/ui/global.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Jamming",
  description: "놀기 위해 모였다! 음악인을 위한 합주 플랫폼",
  keywords: [
    "음악",
    "합주",
    "밴드",
    "잼",
    "잼세션",
    "재밍",
    "Jamming",
    "Jam",
    "Jam Session",
  ],
  openGraph: {
    title: "Jamming - 음악인을 위한 합주 플랫폼",
    description: "놀기 위해 모였다! 다양한 사람과 음악을 공유하고 즐기세요.",
    url: "https://jamming.co.kr",
    siteName: "Jamming",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "Jamming OG Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamming - 음악인을 위한 합주 플랫폼",
    description: "놀기 위해 모였다! 다양한 사람과 음악을 공유하고 즐기세요.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
      </head>
      <body className={`antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
