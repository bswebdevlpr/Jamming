import type { NextConfig } from "next";

// Supabase 스토리지 호스트는 환경변수에서 파생 (인스턴스 주소 하드코딩 방지)
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "i.maniadb.com",
      },
      ...(supabaseHostname
        ? [{ protocol: "https" as const, hostname: supabaseHostname }]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 600, 750, 828, 1024],
    imageSizes: [128, 256, 384, 512],
  },
  // 정적 자산 캐싱 설정
  async headers() {
    return [
      {
        source: "/backgrounds/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
