"use server";

import { FetchFeedFunc } from "@/app/ui/templates/feed";
import { createClient } from "@/app/util/supabase/server";
import { CustomError } from "../errors/error";
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

      data = data.map((row) => {
        row.curHeadCnt = row.jamentry.length;
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

// export const fetchJamMembers: FetchFeedFunc = async ({
//   pageParam = 0,
//   queryFnParam,
// }) => {
//   let ret = { data: null, nextPage: null };

//   try {
//     const { jamId } = JSON.parse(queryFnParam);

//     const supabase = await createClient();

//     let query = supabase
//       .from("user")
//       .select(
//         `
//         *,
//         jamentry!inner(isAllowed)
//       `
//       )
//       .eq("jamentry.jam_id", jamId)
//       .order("created_at", { ascending: false, referencedTable: "jamentry" })
//       .range(pageParam * 4, pageParam * 4 + 3);

//     await query.then(async ({ data, error }) => {
//       if (error) throw CustomError.GetJamFeed;

//       ret.data = data;
//       ret.nextPage = data.length < 4 ? null : pageParam + 1;
//     });
//   } catch (e) {
//     if (e instanceof CustomError) throw e;
//     else throw CustomError.UnExpected;
//   }

//   return ret;
// };
