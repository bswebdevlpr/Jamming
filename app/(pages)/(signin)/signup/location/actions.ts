"use server";

import { CustomError } from "@/app/lib/errors/error";
import { createClient } from "@/app/util/supabase/server";

const supabase = await createClient();

export default async function createUser(input: any) {
  const { error } = await supabase.from("user").insert(input);
  if (error) throw CustomError.UnExpected;

  return !error;
}
