import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    domains: [
      "i.ytimg.com",
      "i.maniadb.com",
      "niiidqqsxsiowmzumcgw.supabase.co",
    ],
  },
};

export default nextConfig;
