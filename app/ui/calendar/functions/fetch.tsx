"use server";

import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/server.error";
import { createClient } from "@/app/util/supabase/server";
import _ from "lodash";
import moment from "moment";

export const getDatesHavingJam: () => Promise<string[]> = async () => {
  let ret = [];

  try {
    const supabase = await createClient();

    // validation
    await getUser(supabase);

    const today = moment()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);

    ret = await supabase
      .from("jamsession")
      .select("datetime")
      .gte("datetime", today.toISOString())
      .lte("datetime", today.clone().add(2, "week").toISOString())
      .then(({ data, error }) => {
        if (error || data.length === 0) throw CustomError.UnExpected;

        return _.uniq(
          data.map((row) => moment(row.datetime).format("YYYYMMDD"))
        );
      });
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
