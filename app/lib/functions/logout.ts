"use client";

import { createClient } from "@/app/util/supabase/client";
import { useSessionStore } from "@/app/stores";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      useSessionStore.getState().resetUserProfile();
      queryClient.clear();
      router.push("/");
    }
  };

  return logout;
}
