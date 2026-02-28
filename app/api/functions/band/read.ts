"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import {
  MapLocationToData,
  MapLevelToData,
  MapGenreToData,
  MapDataToLocation,
  MapDataToLevel,
  MapDataToGenre,
} from "@/app/lib/maps/jam";

export interface Filter_BandList {
  location?: LocationEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
}

// 상수
const BAND_PAGE_SIZE = 15;

const BAND_SELECT_QUERY = `
  *,
  band_member (
    id, user_id, pos, role, joined_at,
    user!inner ( nickname, profile_image, pos, genre, level, bpm )
  )
`;

// DB 형식을 Enum으로 변환하는 헬퍼 함수
function transformBandFromDB(band: any): Entity_Band {
  if (band.location) {
    band.location = MapDataToLocation[band.location as keyof typeof MapDataToLocation];
  }
  if (band.level) {
    band.level = MapDataToLevel[band.level as keyof typeof MapDataToLevel];
  }
  if (band.genre && Array.isArray(band.genre)) {
    band.genre = band.genre.map(
      (g: string) => MapDataToGenre[g as keyof typeof MapDataToGenre]
    );
  }
  return band;
}

export async function getBand(id: string): Promise<Entity_Band> {
  const supabase = await createClient();
  await getUser(supabase);

  const { data, error } = await supabase
    .from("band")
    .select(BAND_SELECT_QUERY)
    .eq("id", id)
    .single();

  if (error) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      error,
      "getBand"
    );
  }
  if (!data) {
    throw CustomError.invalidBand({ operation: "getBand" });
  }

  const transformed = transformBandFromDB(data);
  transformed.memberCount = data.band_member?.length ?? 0;
  return transformed;
}

export async function getMyBands(
  filter?: Filter_BandList
): Promise<{ band: Entity_Band; role: string }[]> {
  const supabase = await createClient();
  const user = await getUser(supabase);

  let query = supabase
    .from("band_member")
    .select(
      `
      band_id, role,
      band!inner (
        id, name, description, genre, location, level, profile_image, tags, created_at, leader_id,
        band_member ( id )
      )
    `
    )
    .eq("user_id", user.id);

  // 서버 측 필터링 (nested relation)
  if (filter?.location && filter.location !== LocationEnum.Everywhere) {
    const dbLocation = MapLocationToData[filter.location];
    query = query.eq("band.location", dbLocation);
  }
  if (filter?.genre) {
    const dbGenre = MapGenreToData[filter.genre];
    query = query.contains("band.genre", [dbGenre]);
  }
  if (filter?.level) {
    const dbLevel = MapLevelToData[filter.level];
    query = query.eq("band.level", dbLevel);
  }

  const { data, error } = await query;

  if (error) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      error,
      "getMyBands"
    );
  }

  return (data ?? []).map((row: any) => {
    const band = transformBandFromDB(row.band);
    band.memberCount = band.band_member?.length ?? 0;

    return {
      band,
      role: row.role,
    };
  });
}

export async function getAllBands(
  filter?: Filter_BandList,
  page?: number
): Promise<{ data: Entity_Band[]; nextPage: number | null }> {
  const supabase = await createClient();
  await getUser(supabase); // 인증 확인

  const currentPage = page ?? 0;

  let query = supabase
    .from("band")
    .select(
      `
      id, name, description, genre, location, level, profile_image, tags, created_at,
      band_member ( id )
    `
    )
    .order("created_at", { ascending: false })
    .range(currentPage * BAND_PAGE_SIZE, (currentPage + 1) * BAND_PAGE_SIZE - 1);

  // 필터 적용
  if (filter?.location && filter.location !== LocationEnum.Everywhere) {
    const dbLocation = MapLocationToData[filter.location];
    query = query.eq("location", dbLocation);
  }
  if (filter?.genre) {
    const dbGenre = MapGenreToData[filter.genre];
    query = query.contains("genre", [dbGenre]);
  }
  if (filter?.level) {
    const dbLevel = MapLevelToData[filter.level];
    query = query.eq("level", dbLevel);
  }

  const { data, error } = await query;

  if (error) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      error,
      "getAllBands"
    );
  }

  // DB 형식을 Enum으로 변환
  const bands = (data ?? []).map((band: any) => {
    const transformed = transformBandFromDB(band);
    transformed.memberCount = band.band_member?.length ?? 0;
    return transformed;
  });

  // 다음 페이지 확인
  const nextPage = bands.length === BAND_PAGE_SIZE ? currentPage + 1 : null;

  return { data: bands, nextPage };
}
