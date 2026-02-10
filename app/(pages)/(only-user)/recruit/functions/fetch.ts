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
  recruit_comment ( id )
`;

export async function fetchRecruitPosts({
  pageParam = 0,
  queryFnParam,
}: {
  pageParam: number;
  queryFnParam: string;
}): Promise<{ data: Entity_RecruitPost[]; nextPage: number | null }> {
  const ret: { data: Entity_RecruitPost[]; nextPage: number | null } = {
    data: [],
    nextPage: null,
  };

  try {
    const filter: Filter_RecruitFeed = JSON.parse(queryFnParam);
    const supabase = await createClient();

    let query = supabase
      .from("recruit_post")
      .select(RECRUIT_LIST_SELECT)
      .eq("is_active", true)
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

    // 각 게시글에 commentCount 추가 및 deadline 체크
    const now = new Date();
    const processedData = (data ?? [])
      .map((row: any) => {
        row.commentCount = row.recruit_comment?.length ?? 0;

        // deadline 자동 마감 체크
        if (row.deadline) {
          const deadline = new Date(row.deadline);
          if (deadline < now) {
            row.is_active = false;
          }
        }

        return row;
      })
      .filter((row: any) => row.is_active);

    // pos 필터 (positions jsonb 내부 검색)
    let filteredData = processedData;
    if (filter.pos) {
      filteredData = processedData.filter((row: any) =>
        (row.positions ?? []).some(
          (p: { pos: string; headcnt: number }) => p.pos === filter.pos
        )
      );
    }

    ret.data = filteredData;
    ret.nextPage =
      (data ?? []).length < PAGE_SIZE ? null : pageParam + 1;
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
