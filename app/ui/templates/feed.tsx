"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CSSProperties, Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";

export type FetchFeedFunc = ({
  pageParam,
  queryFnParam,
}: {
  pageParam: number;
  queryFnParam: any;
}) => Promise<{
  data: any[];
  nextPage: number;
}>;

export default function FeedTemplate({
  queryFn,
  queryFnParam,
  feedItem,
  style,
}: {
  queryFn: FetchFeedFunc;
  queryFnParam: any;
  feedItem: React.FC<any>;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["data"],
    queryFn: (args) => queryFn({ ...args, queryFnParam }),
    getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
  });

  const router = useRouter();

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
          {page.data.map((data, idx) => feedItem({ idx, ...data, router }))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 20, background: "lightgray" }} />
    </div>
  );
}
