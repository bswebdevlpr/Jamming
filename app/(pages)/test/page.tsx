"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/app/util/supabase/client";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import VerticalList from "@/app/ui/lists/list";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToLocation,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import FeedItem_Jam from "@/app/ui/feeds/feed-item";

const fetchJams = async ({ pageParam = 0 }) => {
  const supabase = await createClient();

  console.log(pageParam);

  const res = await supabase
    .from("jamsession")
    .select()
    .range(pageParam, pageParam + 5)
    .then(({ data }) => {
      if (data.length > 0)
        data = data.map((row) => {
          row.location = MapDataToLocation[row.location];
          row.pos = MapDataToPosition[row.pos];
          row.genre = MapDataToGenre[row.genre];
          row.level = MapDataToLevel[row.level];

          return row;
        });
      return data;
    });
  console.log(res);

  return res;
};

export default function TestPage() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 0,
      queryKey: ["jams"],
      queryFn: fetchJams,
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
    });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    console.log("바뀌긴함?", data);
  }, [data]);

  if (isLoading) return <p>Fuck is loading</p>;
  if (!data) return <p>Fuck theres nothing</p>;

  return (
    <div>
      {data?.pages.map((page) =>
        page.map((jam, idx) => (
          <FeedItem_Jam
            key={idx}
            title={jam.title}
            location={jam.location}
            pos={jam.pos}
            genre={jam.genre}
            level={jam.level}
            maxHeadCnt={jam.maxHeadCnt}
          />
        ))
      )}
      <div ref={ref} style={{ height: 20, background: "lightgray" }} />
    </div>
  );
}
