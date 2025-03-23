"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  CSSProperties,
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useImperativeHandle,
} from "react";
import { useRouter } from "next/navigation";
import { globalContext } from "@/app/(pages)/layout";

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

export interface FeedProps {
  queryFn: FetchFeedFunc;
  queryFnParam: any;
  feedItem: React.FC<any>;
  style?: CSSProperties;
}
export interface FeedMethods {
  refetch: (args?: any) => any;
}

const FeedTemplate = forwardRef<FeedMethods, FeedProps>(
  ({ queryFn, queryFnParam, feedItem, style }, ref) => {
    const { ref: innerRef, inView } = useInView();

    const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
      useInfiniteQuery({
        initialPageParam: 0,
        queryKey: ["data", queryFnParam],
        queryFn: ({ pageParam = 0 }) => queryFn({ pageParam, queryFnParam }),
        getNextPageParam: (lastPage, pages) =>
          lastPage.nextPage ?? pages.length,
      });

    useImperativeHandle(ref, () => ({
      refetch,
    }));

    const router = useRouter();
    const { bottomSheet } = useContext(globalContext);

    useEffect(() => {
      if (inView && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isLoading, fetchNextPage]);

    return isLoading ? (
      "loading..."
    ) : (
      <div
        className="w-full h-full overflow-without-scroll"
        style={{
          ...style,
        }}>
        {data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.data.map((data, idx) =>
              feedItem({ idx, data, router, bottomSheet, refetch })
            )}
          </Fragment>
        ))}
        <div ref={innerRef} style={{ height: 20, background: "transparent" }} />
      </div>
    );
  }
);
FeedTemplate.displayName = "FeedTemplate";

export default FeedTemplate;
