"use client";

import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate from "@/app/ui/templates/feed";

export default function JamFeed({
  selectedDate,
}: {
  selectedDate: moment.Moment;
}) {
  return (
    <FeedTemplate
      queryFn={fetchJams}
      queryFnParam={selectedDate
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .toISOString()}
      feedItem={FeedItem_Jam}
    />
  );
}
