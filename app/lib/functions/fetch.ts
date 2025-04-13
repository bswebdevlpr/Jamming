"use server";

import { FetchFeedFunc } from "@/app/ui/templates/feed";
import { createClient } from "@/app/util/supabase/server";
import { CustomError } from "../errors/server.error";
import moment from "moment";
import _ from "lodash";
import {
  MapGenreToData,
  MapLevelToData,
  MapLocationToData,
  MapPositionToData,
} from "../maps/jam";
import { Filter_JamSessionFeed } from "@/app/ui/feeds/jam-feed";

export const fetchJams: FetchFeedFunc = async ({
  pageParam = 0,
  queryFnParam,
}) => {
  let ret = { data: null, nextPage: null };

  try {
    const convertedParam: Filter_JamSessionFeed = JSON.parse(queryFnParam);
    if (!convertedParam.selectedDate) return ret;

    const supabase = await createClient();

    const date = moment(convertedParam.selectedDate);

    let query = supabase
      .from("jamsession")
      .select(
        `
        *,
        jamentry ( id, user_id )
      `
      )
      .gte(
        "datetime",
        date
          .clone()
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toISOString()
      )
      .lte(
        "datetime",
        date
          .clone()
          .set("hour", 23)
          .set("minute", 59)
          .set("second", 59)
          .toISOString()
      )
      .order("created_at", { ascending: false })
      .range(pageParam * 6, pageParam * 6 + 5);

    if (convertedParam.location)
      query = query.contains("location", [
        MapLocationToData[convertedParam.location],
      ]);
    if (convertedParam.genre)
      query = query.contains("genre", [MapGenreToData[convertedParam.genre]]);
    if (convertedParam.position)
      query = query.contains("pos", [
        MapPositionToData[convertedParam.position],
      ]);
    if (convertedParam.level)
      query = query.contains("level", [MapLevelToData[convertedParam.level]]);

    await query.then(async ({ data, error }) => {
      if (error) throw CustomError.GetJamFeed;

      data.forEach((row) => {
        row.curHeadCnt = row.jamentry.length;
        row.maxHeadCnt = row.headcnt_by_pos.reduce(
          (acc, cur) => acc + cur.headcnt,
          0
        );

        row.thumbnail =
          row.images.length > 0 &&
          supabase.storage
            .from(process.env.SUPABASE_STORAGE_NAME)
            .getPublicUrl(
              `${row.user_id}/jamsession/${row.id}/${row.images[0]}`
            ).data.publicUrl;
      });

      if (convertedParam.atMyAct) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        data = data
          .filter((row) => row.user_id === user.id || row.jamentry.length > 0)
          .map((row) => {
            row.isMyJam = row.user_id === user.id;

            return row;
          });
      }

      ret.data = data;
      ret.nextPage = data.length < 6 ? null : pageParam + 1;
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
