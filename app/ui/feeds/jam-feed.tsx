"use client";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate from "@/app/ui/templates/feed";
import { useMemo } from "react";

export interface Filter_JamSessionFeed {
  selectedDate: moment.Moment;
  myJam?: boolean;
  location?: LocationEnum;
  genre?: GenreEnum;
  position?: PositionEnum;
  level?: LevelEnum;
}

export function JamFeed({ filter }: { filter: Filter_JamSessionFeed }) {
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

// export function MyAct_MemberFeed({ jamId }: { jamId: number }) {
//   const MemberFeedComponent = useMemo(() => {
//     return (
//       <FeedTemplate
//         queryFn={fetchJamMembers}
//         queryFnParam={JSON.stringify({ jamId })}
//         feedItem={FeedItem_UserProfile}
//       />
//     );
//   }, [jamId]);

//   return <>{MemberFeedComponent}</>;
// }
