"use server";

import { createClient } from "@/app/util/supabase/server";

const supabase = await createClient();

export default async function createUser(input: any) {
  const res = await supabase.from("user").insert(input);
  return;
}
