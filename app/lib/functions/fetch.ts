"use server";

import { FetchFeedFunc } from "@/app/ui/templates/feed";
import { createClient } from "@/app/util/supabase/server";
import { CustomError } from "../errors/error";
import moment from "moment";

export const fetchJams: FetchFeedFunc = async ({
  pageParam = 0,
  queryFnParam,
}) => {
  let ret = { data: null, nextPage: null };

  try {
    const supabase = await createClient();

    const date = moment(queryFnParam);

    await supabase
      .from("jamsession")
      .select(
        `
        *,
        jamEntry ( id, userId )
      `
      )
      .gte(
        "date",
        date
          .clone()
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toISOString()
      )
      .lte(
        "date",
        date
          .clone()
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .toISOString()
      )
      .order("created_at", { ascending: false })
      .range(pageParam * 6, pageParam * 6 + 5)
      .then(({ data, error }) => {
        if (error) throw CustomError.GetJamFeed;

        data = data.map((row) => {
          row.curHeadCnt = row.jamEntry.length;
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
