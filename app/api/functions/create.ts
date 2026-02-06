"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function createJamEntry(
  input: CreateJamEntryDto
): Promise<boolean> {
  try {
    input.appeal = await sanitize(input.appeal);

    const supabase = await createClient();

    const { error } = await supabase.from("jamentry").insert(input);

    if (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return false;
    }

    return true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    throw CustomError.UnExpected;
  }
}
