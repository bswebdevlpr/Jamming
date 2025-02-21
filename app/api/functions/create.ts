"use server";

import { CustomError } from "@/app/lib/errors/error";
import { FormData_Post } from "@/app/lib/zod";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function createJam(data: FormData_Post): Promise<boolean> {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("jamsession").insert(data);
    ret = !!error;
  } catch (e) {
    throw CustomError.UnExpected;
  }

  return ret;
}

export async function createJamEntry(
  input: CreateJamEntryDto
): Promise<boolean> {
  let ret: boolean = false;

  try {
    input.appeal = await sanitize(input.appeal);

    const supabase = await createClient();

    const { data, error } = await supabase.from("jamEntry").insert(input);
    console.log(data, error);

    ret = !!error;
  } catch (e) {
    throw CustomError.UnExpected;
  }

  return ret;
}
