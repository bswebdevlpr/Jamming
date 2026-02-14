"use server";

import { getMyBands, getBand, Filter_BandList } from "@/app/api/functions/band/read";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";

export { type Filter_BandList } from "@/app/api/functions/band/read";

export async function fetchMyBands(
  filter?: Filter_BandList
): Promise<ActionResult<{ band: Entity_Band; role: string }[]>> {
  return safeAction("fetchMyBands", async () => {
    return await getMyBands(filter);
  });
}

export async function fetchBand(
  id: string
): Promise<ActionResult<Entity_Band>> {
  return safeAction("fetchBand", async () => {
    return await getBand(id);
  });
}
