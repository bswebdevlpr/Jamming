"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  CSSProperties,
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
} from "react";
import { useRouter } from "next/navigation";
import { useBottomSheetStore } from "@/app/stores";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_VARIANTS } from "@/app/lib/animations";

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
  skeleton?: React.ReactNode;
  style?: CSSProperties;
  emptyState?: React.ReactNode;
}
export interface FeedMethods {
  refetch: (args?: any) => any;
}

const FeedTemplate = forwardRef<FeedMethods, FeedProps>(
  ({ queryFn, queryFnParam, feedItem, skeleton, style, emptyState }, ref) => {
    const { ref: innerRef, inView } = useInView();

    const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
      useInfiniteQuery({
        initialPageParam: 0,
        queryKey: ["data", queryFnParam],
        queryFn: ({ pageParam = 0 }) => queryFn({ pageParam, queryFnParam }),
        getNextPageParam: (lastPage, pages) =>
          lastPage.nextPage ?? pages.length,
        staleTime: 1000 * 60 * 5, // 5분
        refetchOnWindowFocus: false,
      });

    useImperativeHandle(ref, () => ({
      refetch,
    }));

    const router = useRouter();
    const bottomSheet = useBottomSheetStore();

    useEffect(() => {
      if (inView && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isLoading, fetchNextPage]);

    return (
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            variants={FADE_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-full"
          >
            {skeleton || "loading..."}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="w-full h-full overflow-without-scroll"
            style={{
              ...style,
            }}
            variants={FADE_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            {data?.pages.every((page) => page.data.length === 0) ? (
              emptyState ?? null
            ) : (
              <>
                {data?.pages.map((page, pageIndex) => (
                  <Fragment key={pageIndex}>
                    {page.data.map((data, idx) =>
                      feedItem({ idx, data, router, bottomSheet, refetch })
                    )}
                  </Fragment>
                ))}
                <div ref={innerRef} style={{ height: 20, background: "transparent" }} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
FeedTemplate.displayName = "FeedTemplate";

export default FeedTemplate;
