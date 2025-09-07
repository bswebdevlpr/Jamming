import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jamming.co.kr",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // TODO: 여기에 다른 정적 페이지 경로들을 추가해주세요.
    // 예: /about, /faq 등
    // {
    //   url: 'https://jamming.co.kr/about',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];
}
