"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { getUser } from "../read";

const BAND_SELECT_QUERY = `
  *,
  band_member (
    id, user_id, pos, role, joined_at,
    user ( nickname, profile_image, pos, genre, level, bpm )
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

export async function getMyBands(): Promise<
  { band: Entity_Band; role: string }[]
> {
  const supabase = await createClient();
  const user = await getUser(supabase);

  const { data, error } = await supabase
    .from("band_member")
    .select(
      `
      band_id, role,
      band (
        id, name, description, genre, location, level, profile_image, tags, created_at, leader_id,
        band_member ( id )
      )
    `
    )
    .eq("user_id", user.id);

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
