import type { NextConfig } from "next";

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
      {
        protocol: "https",
        hostname: "niiidqqsxsiowmzumcgw.supabase.co",
      },
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
