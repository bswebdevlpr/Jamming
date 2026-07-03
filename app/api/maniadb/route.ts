import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import xml2js from "xml2js";
import { JaroWinklerDistance } from "natural";
import { FetchResult } from "../types/response.interface";
import { logger } from "@/app/lib/logger";
import _ from "lodash";
import { createClient } from "@/app/util/supabase/server";
import { externalSearchLimiter, getClientIPFromHeaders } from "@/app/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 인증 필수 (곡 검색은 로그인 사용자 전용 플로우에서만 사용)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { status: 401, msg: "Unauthorized", data: null },
      { status: 401 }
    );

  // Rate limiting: 외부 API 쿼터 남용 방지 (IP 기준)
  const ip = await getClientIPFromHeaders();
  const { success } = await externalSearchLimiter.limit(`maniadb:${ip}`);
  if (!success)
    return NextResponse.json(
      { status: 429, msg: "Too many requests", data: null },
      { status: 429 }
    );

  const { songName } = await req.json();
  if (!songName)
    return NextResponse.json({
      status: 500,
      msg: "Failed to get the name of song.",
      data: null,
    });

  const maniadbKey = process.env.MANIADB_KEY;
  if (!maniadbKey) {
    logger.error("maniadb.config", new Error("MANIADB_KEY is not defined"));
    return NextResponse.json({
      status: 500,
      msg: "Search is not configured.",
      data: null,
    });
  }

  const parser = new xml2js.Parser();
  const compare = JaroWinklerDistance;

  const data: FetchResult = await axios
    .get(
      `https://www.maniadb.com/api/search/${encodeURIComponent(
        songName
      )}/?sr=song&display=10&key=${maniadbKey}&v=0.5`
    )
    .then(async (res) => {
      const parsedByPromise = await parser
        .parseStringPromise(res.data)
        .then((result) => {
          if (!result)
            return {
              status: 500,
              msg: "Failed to parse the result",
              data: null,
            };

          const { item } = result?.rss?.channel[0];

          const data = item
            .map((row) => {
              const title = row.title[0].replace(/&nbsp;/g, " ");
              const artist = row["maniadb:artist"][0].name[0].replace(
                /&nbsp;/g,
                " "
              );
              const album_cover_url = row["maniadb:album"][0].image[0];

              return {
                title,
                artist,
                album_cover_url,
                titleSimiliarity: !title ? 0 : compare(songName, title),
              };
            })
            .filter((row) => !/inst\./i.test(row.title))
            .sort((b, a) =>
              a.titleSimiliarity !== b.titleSimiliarity
                ? a.titleSimiliarity - b.titleSimiliarity
                : a.albumTitleSimiliarity - b.albumTitleSimiliarity
            )
            .map((row) => {
              _.unset(row, "titleSimiliarity");
              return row;
            });

          return {
            status: 200,
            msg: "Success",
            data,
          };
        })
        .catch((e) => {
          logger.error("maniadb.parseXml", e);
          return {
            status: 500,
            msg: "Failed to request",
            data: null,
          };
        });
      return parsedByPromise;
    });

  return NextResponse.json(data);
}
