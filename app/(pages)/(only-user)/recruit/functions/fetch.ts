"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_RecruitPost } from "@/app/lib/interfaces/entity.interface";
import { logger } from "@/app/lib/logger";
import { createClient } from "@/app/util/supabase/server";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";

export interface Filter_RecruitFeed {
  location?: LocationEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  pos?: PositionEnum;
}

const PAGE_SIZE = 10;

const RECRUIT_LIST_SELECT = `
  id, title, positions, genre, level, location, view_count, deadline, is_active, created_at,
  band ( id, name, profile_image ),
  recruit_comment ( id, is_accepted )
`;

export async function fetchRecruitPosts({
  pageParam = 0,
  filter,
}: {
  pageParam: number;
  filter: Filter_RecruitFeed;
}): Promise<{ data: Entity_RecruitPost[]; nextPage: number | null }> {
  const ret: { data: Entity_RecruitPost[]; nextPage: number | null } = {
    data: [],
    nextPage: null,
  };

  try {
    const supabase = await createClient();

    let query = supabase
      .from("recruit_post")
      .select(RECRUIT_LIST_SELECT)
      .eq("is_active", true)
      .or(`deadline.is.null,deadline.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false })
      .range(
        pageParam * PAGE_SIZE,
        pageParam * PAGE_SIZE + PAGE_SIZE - 1
      );

    // 조건부 필터
    if (filter.location) {
      query = query.eq("location", filter.location);
    }
    if (filter.genre) {
      query = query.contains("genre", [filter.genre]);
    }
    if (filter.level) {
      query = query.contains("level", [filter.level]);
    }

    const { data, error } = await query;

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "fetchRecruitPosts"
      );
    }

    // 각 게시글에 commentCount/acceptedCount 추가 및 타입 변환
    const processedData = (data ?? []).map((row) => {
      const { recruit_comment, ...rest } = row;
      return {
        ...rest,
        band: Array.isArray(row.band) ? row.band[0] : row.band,
        commentCount: recruit_comment?.length ?? 0,
        acceptedCount: (recruit_comment ?? []).filter((c: { is_accepted: boolean | null }) => c.is_accepted === true).length,
      };
    }) as Entity_RecruitPost[];

    // pos 필터 (positions jsonb 내부 검색)
    let filteredData = processedData;
    if (filter.pos) {
      filteredData = processedData.filter((row) =>
        (row.positions ?? []).some((p) => p.pos === filter.pos)
      );
    }

    ret.data = filteredData;
    // 필터링 후 결과 기준으로 nextPage 계산
    ret.nextPage = filteredData.length < PAGE_SIZE ? null : pageParam + 1;
  } catch (e) {
    logger.error("fetchRecruitPosts", e);
    if (e instanceof CustomError) throw e;
    else
      throw CustomError.unexpected({
        operation: "fetchRecruitPosts",
        originalError: e,
      });
  }

  return ret;
}
