"use client";

import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/app/stores";
import { PUBLIC_PATHS } from "@/app/lib/constants/paths";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userProfile, setUserProfile, resetUserProfile } = useSessionStore();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const [isLoading, setIsLoading] = useState<boolean>(!isPublicPath);

  useEffect(() => {
    if (isPublicPath) return;

    const supabase = createClient();

    const validateUser = async () => {
      try {
        if (!userProfile.isLoaded) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (!user || error) {
            router.push("/signin");
            return;
          }

          const { data, error: dbError } = await supabase
            .from("user")
            .select("*, playlist(*)")
            .eq("id", user.id)
            .maybeSingle();

          if (!data || dbError) {
            resetUserProfile();
            await supabase.auth.signOut();
            router.push("/signin");
            return;
          }

          setUserProfile({ ...data, isLoaded: true });
        }

        setIsLoading(false);
      } catch (e) {
        router.push("/signin");
      }
    };
    validateUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          resetUserProfile();
          router.push("/signin");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return isLoading ? <FullScreenLoading /> : children;
}
