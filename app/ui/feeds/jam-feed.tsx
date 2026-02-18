"use client";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { fetchJams } from "@/app/lib/functions/fetch";
import { FeedItem_Jam } from "@/app/ui/feeds/feed-item";
import FeedTemplate, { FeedMethods } from "@/app/ui/templates/feed";
import { JamFeedSkeleton } from "@/app/ui/loading/skeleton";
import { Dispatch, SetStateAction } from "react";
import JamSessionEmpty from "@/app/ui/empty-states/jam-session-empty";

export interface Filter_JamSessionFeed {
  selectedDate: moment.Moment;
  location?: LocationEnum;
  genre?: GenreEnum;
  position?: PositionEnum;
  level?: LevelEnum;
  atMyAct?: boolean;
  includeWithDrawn?: boolean;
  setResetSlideCalendarDots?: Dispatch<SetStateAction<boolean>>;
}

export function JamFeed({
  filter,
  ref,
  emptyState,
}: {
  filter: Filter_JamSessionFeed;
  ref?: React.Ref<FeedMethods>;
  emptyState?: React.ReactNode;
}) {
  return (
    <FeedTemplate
      ref={ref}
      queryFn={fetchJams}
      queryFnParam={JSON.stringify(filter)}
      feedItem={FeedItem_Jam}
      skeleton={<JamFeedSkeleton />}
      emptyState={emptyState ?? <JamSessionEmpty />}
    />
  );
}
