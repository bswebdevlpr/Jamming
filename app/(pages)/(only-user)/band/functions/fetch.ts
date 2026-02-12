"use server";

import { getMyBands, getBand } from "@/app/api/functions/band/read";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { Entity_Band } from "@/app/lib/interfaces/entity.interface";

export async function fetchMyBands(): Promise<
  ActionResult<{ band: Entity_Band; role: string }[]>
> {
  return safeAction("fetchMyBands", async () => {
    return await getMyBands();
  });
}

export async function fetchBand(
  id: number
): Promise<ActionResult<Entity_Band>> {
  return safeAction("fetchBand", async () => {
    return await getBand(id);
  });
}
