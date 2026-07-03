"use server";

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { FetchResult } from "../../types/response.interface";
import { logger } from "@/app/lib/logger";
import sanitizeHtml from "sanitize-html";
import { createClient } from "@/app/util/supabase/server";
import { externalSearchLimiter, getClientIPFromHeaders } from "@/app/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 인증 필수 (장소 검색은 로그인 사용자 전용 플로우에서만 사용)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { status: 401, msg: "Unauthorized", data: null },
      { status: 401 }
    );

  // Rate limiting: 유료 Naver API 쿼터 남용 방지 (IP 기준)
  const ip = await getClientIPFromHeaders();
  const { success } = await externalSearchLimiter.limit(`naver:${ip}`);
  if (!success)
    return NextResponse.json(
      { status: 429, msg: "Too many requests", data: null },
      { status: 429 }
    );

  const { location } = await req.json();
  if (!location)
    return NextResponse.json({
      status: 500,
      msg: "Failed to get the name of song.",
      data: null,
    });

  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
    location
  )}`;

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
