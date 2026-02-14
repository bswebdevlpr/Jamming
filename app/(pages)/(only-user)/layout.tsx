"use client";

import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore, useNotificationStore } from "@/app/stores";
import { PUBLIC_PATHS } from "@/app/lib/constants/paths";
import { getUnreadCount } from "@/app/api/functions/notification";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userProfile, setUserProfile, resetUserProfile } = useSessionStore();
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
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
            router.replace("/signin");
            return;
          }

          const { data, error: dbError } = await supabase
            .from("user")
            .select("*, playlist(*)")
            .eq("id", user.id)
            .maybeSingle();

          if (!data || dbError) {
            if (process.env.NODE_ENV === "development") {
              console.error("[layout] User data fetch failed:", {
                hasData: !!data,
                error: dbError,
              });
            }
            resetUserProfile();
            await supabase.auth.signOut();
            router.replace("/signin");
            return;
          }

          if (process.env.NODE_ENV === "development") {
            console.log("[layout] User data fetched:", {
              userId: data.id,
              playlistCount: data.playlist?.length ?? "null/undefined",
              hasPlaylist: !!data.playlist,
            });
          }

          setUserProfile({ ...data, isLoaded: true });
        }

        // 미읽음 알림 개수 로드
        getUnreadCount()
          .then((result) => {
            if (result.success === true) {
              setUnreadCount(result.data);
            } else {
              setUnreadCount(0);
            }
          })
          .catch((e) => {
            if (process.env.NODE_ENV === "development") {
              console.error("Failed to load unread count:", e);
            }
            setUnreadCount(0);
          });

        setIsLoading(false);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error("[only-user layout] Auth validation failed:", e);
        }
        router.replace("/signin");
      }
    };
    validateUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          resetUserProfile();
          router.replace("/signin");
        }
        // 토큰 갱신 성공 시 (로깅만)
        if (event === "TOKEN_REFRESHED" && process.env.NODE_ENV === "development") {
          console.log("[Auth] Session refreshed successfully");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return isLoading ? <FullScreenLoading /> : children;
}
