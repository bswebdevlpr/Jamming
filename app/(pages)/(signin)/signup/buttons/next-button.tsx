import _ from "lodash";
import { redirect } from "next/navigation";

export function debouncedRedirect(
  nextPath: string,
  queryStr?: string,
  queryObj?: { [key: string]: any }
) {
  _.debounce(
    redirect(
      `${nextPath}?${queryStr ? queryStr : ""}${
        queryObj &&
        (queryStr ? "&" : "") + new URLSearchParams(queryObj).toString()
      }`
    )
  );
}
