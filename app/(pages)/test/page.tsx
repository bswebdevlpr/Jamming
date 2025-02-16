"use client";

import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate from "@/app/ui/templates/feed";

export default function TestPage() {
  return <FeedTemplate queryFn={fetchJams} feedItem={FeedItem_Jam} />;
}
