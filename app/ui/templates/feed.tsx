"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CSSProperties, Fragment, useEffect } from "react";

export type FetchFeedFunc = ({ pageParam }: { pageParam: number }) => Promise<{
  data: any[];
  nextPage: number;
}>;

export default function FeedTemplate({
  queryFn,
  feedItem,
  style,
}: {
  queryFn: FetchFeedFunc;
  feedItem: React.FC<any>;
  style?: CSSProperties;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["data"],
    queryFn,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return isLoading ? (
    "loading..."
  ) : (
    <div
      className="w-full h-full overflow-without-scroll"
      style={{
        ...style,
      }}
    >
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.data.map((data, idx) => feedItem({ idx, ...data }))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 20, background: "lightgray" }} />
    </div>
  );
}
