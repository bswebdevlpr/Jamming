import { MetadataRoute } from "next";
import { PUBLIC_PATHS } from "@/app/lib/constants/paths";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", ...PUBLIC_PATHS],
        disallow: ["/mypage", "/myact", "/signup", "/user-profile", "/api/"],
      },
    ],
    sitemap: "https://jamming.co.kr/sitemap.xml",
  };
}
