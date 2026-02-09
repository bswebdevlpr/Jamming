"use server";

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { FetchResult } from "../../types/response.interface";
import { logger } from "@/app/lib/logger";
import sanitizeHtml from "sanitize-html";

export async function POST(req: NextRequest) {
  const { location } = await req.json();
  if (!location)
    return NextResponse.json({
      status: 500,
      msg: "Failed to get the name of song.",
      data: null,
    });

  const url = `https://openapi.naver.com/v1/search/local.json?query=${location}`;

  const data: FetchResult = await axios
    .get(url, {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_MAP_ID,
        "X-Naver-Client-Secret": process.env.NAVER_MAP_SECRET,
      },
    })
    .then(async (res) => {
      let data = [];

      if (res.data && res.data.items.length > 0) {
        data = res.data.items.map((row) => ({
          name: sanitizeHtml(row?.title, {
            allowedTags: [],
            disallowedTagsMode: "discard",
          }),
          address: row?.address,
          category: row?.category,
        }));
      }

      return {
        status: 200,
        msg: "Success",
        data,
      };
    })
    .catch((e) => {
      logger.error("naver.map.search", e);
      return {
        status: 500,
        msg: "Failed to request",
        data: null,
      };
    });

  return NextResponse.json(data);
}
