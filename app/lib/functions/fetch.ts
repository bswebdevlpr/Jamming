"use server";

import { FetchFeedFunc } from "@/app/ui/templates/feed";
import { createClient } from "@/app/util/supabase/server";
import { CustomError } from "../errors/error";

export const fetchJams: FetchFeedFunc = async ({
  pageParam = 0,
  queryFnParam: date,
}) => {
  let ret = { data: null, nextPage: null };

  try {
    const supabase = await createClient();

    await supabase
      .from("jamsession")
      .select(
        `
        *,
        jamEntry ( id, userId )
      `
      )
      .eq("date", date)
      .order("created_at", { ascending: false })
      .range(pageParam * 6, pageParam * 6 + 5)
      .then(({ data, error }) => {
        console.log(date);
        console.log("실화?", data, error);

        if (error) throw CustomError.GetJamFeed;

        data = data.map((row) => {
          row.curHeadCnt = row.jamEntry.length;
          return row;
        });

        ret.data = data;
        ret.nextPage = data.length < 6 ? null : pageParam + 1;
      });
  } catch (e) {
    console.log("에러!", e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
