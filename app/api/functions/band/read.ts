"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";

export interface Filter_BandList {
  location?: LocationEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
}

const BAND_SELECT_QUERY = `
  *,
  band_member (
    id, user_id, pos, role, joined_at,
    user!inner ( nickname, profile_image, pos, genre, level, bpm )
  )
`;

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

  data.memberCount = data.band_member?.length ?? 0;
  return data;
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
  if (filter?.location) {
    query = query.eq("band.location", filter.location);
  }
  if (filter?.genre) {
    query = query.contains("band.genre", [filter.genre]);
  }
  if (filter?.level) {
    query = query.eq("band.level", filter.level);
  }

  const { data, error } = await query;

  if (error) {
    throw CustomError.fromSupabaseError(
      ErrorCode.UNEXPECTED,
      error,
      "getMyBands"
    );
  }

  return (data ?? []).map((row: any) => ({
    band: {
      ...row.band,
      memberCount: row.band.band_member?.length ?? 0,
    },
    role: row.role,
  }));
}
