"use server";

import { FetchFeedFunc } from "@/app/ui/templates/feed";
import { createClient } from "@/app/util/supabase/server";
import { CustomError } from "../errors/error";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToLocation,
  MapDataToPosition,
} from "@/app/lib/maps/jam";

export const fetchJams: FetchFeedFunc = async ({ pageParam = 0 }) => {
  let ret = { data: null, nextPage: null };

  try {
    const supabase = await createClient();

    await supabase
      .from("jamsession")
      .select()
      .order("created_at", { ascending: false })
      .range(pageParam * 6, pageParam * 6 + 5)
      .then(({ data, error }) => {
        if (error) throw CustomError.GetJamFeed;

        if (data.length > 0)
          data = data.map((row) => {
            row.location = MapDataToLocation[row.location];
            row.pos = MapDataToPosition[row.pos];
            row.genre = MapDataToGenre[row.genre];
            row.level = MapDataToLevel[row.level];

            return row;
          });

        ret.data = data;
        ret.nextPage = data.length < 6 ? null : pageParam + 1;
      });
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
