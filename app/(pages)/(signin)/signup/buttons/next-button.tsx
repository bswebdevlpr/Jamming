"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import _ from "lodash";

export function useDebouncedRedirect(delay = 300) {
  const router = useRouter();

  return useCallback(
    _.debounce((nextPath: string, queryStr?: string, queryObj?: { [key: string]: any }) => {
      let url = nextPath;
      const params = new URLSearchParams();

      if (queryStr) {
        for (const [key, value] of new URLSearchParams(queryStr)) {
          params.append(key, value);
        }
      }
      if (queryObj) {
        for (const [key, value] of Object.entries(queryObj)) {
          params.append(key, String(value));
        }
      }
      if ([...params].length > 0) {
        url += `?${params.toString()}`;
      }
      router.push(url);
    }, delay),
    [router, delay]
  );
}
