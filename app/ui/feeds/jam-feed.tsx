"use client";

import { Filter_JamSessionFeed } from "@/app/(pages)/(only-user)/jamsession/page";
import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate from "@/app/ui/templates/feed";
import { useMemo } from "react";

export default function JamFeed({ filter }: { filter: Filter_JamSessionFeed }) {
  const JamFeedComponent = useMemo(() => {
    return (
      <FeedTemplate
        queryFn={fetchJams}
        queryFnParam={JSON.stringify(filter)}
        feedItem={FeedItem_Jam}
      />
    );
  }, [filter]);

  return <>{JamFeedComponent}</>;
}
