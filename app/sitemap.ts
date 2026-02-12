import { MetadataRoute } from "next";
import { createClient } from "@/app/util/supabase/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://jamming.co.kr",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://jamming.co.kr/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const twoWeeksLater = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: sessions } = await supabase
      .from("jamsession")
      .select("id, created_at, datetime")
      .gte("datetime", now)
      .lte("datetime", twoWeeksLater)
      .order("datetime", { ascending: false });

    const sessionPages: MetadataRoute.Sitemap = (sessions || []).map(
      (session) => ({
        url: `https://jamming.co.kr/jamsession/post/${session.id}`,
        lastModified: new Date(session.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    return [...staticPages, ...sessionPages];
  } catch {
    return staticPages;
  }
}
