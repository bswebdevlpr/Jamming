import { Metadata } from "next";
import { getJamPublic } from "@/app/api/functions/read";
import { MapDataToGenre, MapDataToLocation } from "@/app/lib/maps/jam";
import WorkSpace from "@/app/ui/layouts/workspace";
import { cache, ReactNode } from "react";
import { sanitizeForJsonLd } from "@/app/lib/functions/validate";

const getJamPublicCached = cache((id: number) => getJamPublic(id));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const jam = await getJamPublicCached(Number(id));
    if (!jam) return {};

    const title = jam.title || "잼세션";
    const location = jam.location ? MapDataToLocation[jam.location] : "";
    const genre = jam.genre ? MapDataToGenre[jam.genre] : "";
    const bodyPreview = jam.body?.slice(0, 100) || "";
    const description = `${location} ${genre} 잼세션${bodyPreview ? ` - ${bodyPreview}` : ""}`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Jamming`,
        description,
        type: "article",
        url: `https://jamming.co.kr/jamsession/post/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Jamming`,
        description,
      },
    };
  } catch {
    return {};
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jsonLd = null;

  try {
    const jam = await getJamPublicCached(Number(id));
    if (jam) {
      const location = jam.location ? MapDataToLocation[jam.location] : "";
      const genre = jam.genre ? MapDataToGenre[jam.genre] : "";

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "MusicEvent",
        name: sanitizeForJsonLd(jam.title) || "잼세션",
        description:
          sanitizeForJsonLd(jam.body?.slice(0, 200)) ||
          `${location} ${genre} 잼세션`,
        startDate: jam.datetime || undefined,
        location: jam.location_detail
          ? {
              "@type": "Place",
              name: sanitizeForJsonLd(jam.location_detail.name),
              address: sanitizeForJsonLd(jam.location_detail.address),
            }
          : undefined,
        organizer: jam.user
          ? {
              "@type": "Person",
              name: sanitizeForJsonLd(jam.user.nickname),
            }
          : undefined,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          "https://schema.org/OfflineEventAttendanceMode",
      };
    }
  } catch {
    // JSON-LD 실패 시 무시
  }

  return (
    <WorkSpace>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </WorkSpace>
  );
}
