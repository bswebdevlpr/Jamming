import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jamsession/post/"],
        disallow: ["/mypage", "/myact", "/signup", "/user-profile", "/api/"],
      },
    ],
    sitemap: "https://jamming.co.kr/sitemap.xml",
  };
}
