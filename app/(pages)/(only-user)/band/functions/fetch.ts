"use server";

import { getMyBands } from "@/app/api/functions/band/read";
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
