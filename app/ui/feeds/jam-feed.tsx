"use client";

import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate from "@/app/ui/templates/feed";
import { useMemo } from "react";

export default function JamFeed({
  selectedDate,
}: {
  selectedDate: moment.Moment;
}) {
  const JamFeedComponent = useMemo(() => {
    return (
      <FeedTemplate
        queryFn={fetchJams}
        queryFnParam={selectedDate.format("YYYY-MM-DD")}
        feedItem={FeedItem_Jam}
      />
    );
  }, [selectedDate]);

  return <>{JamFeedComponent}</>;
}
