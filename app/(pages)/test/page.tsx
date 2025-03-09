"use client";

import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate from "@/app/ui/templates/feed";
import { useEffect, useState } from "react";

import axios from "axios";

function extractVideoId(url: string): string | null {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([^?&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function TestPage() {
  const videoId = extractVideoId(
    "https://youtu.be/5l8gIRUfhjc?si=X2BezBjqtTZBzbnX"
  );
  if (!videoId) {
    console.log("❌ 유효한 유튜브 링크가 아닙니다.");
    return;
  }

  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${"AIzaSyBgb4GlLM0rfJ97aTg6ShwTdd8SYBH3JY8"}`;

      const response = await axios.get(url);
      const video = response.data.items[0];

      if (!video) {
        console.log("❌ 영상을 찾을 수 없습니다.");
        return;
      }

      console.log(response.data);

      const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

      console.log("🎬 제목:", title, channelTitle, publishedAt);
      console.log("🖼️ 썸네일:", thumbnails);
    })();
  }, []);

  return <div>{videoId}</div>;
}
