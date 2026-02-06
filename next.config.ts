import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
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
  },
};

export default nextConfig;
