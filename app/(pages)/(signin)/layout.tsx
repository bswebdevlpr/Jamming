"use client";

import WorkSpace from "@/app/ui/layouts/workspace";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionStore } from "@/app/stores";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOAuthSignedIn, setIsOAuthSignedIn] = useState<boolean>(false);
  const setUserProfile = useSessionStore((state) => state.setUserProfile);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!user || error) {
          router.push("/signin");
          return;
        }

        setIsOAuthSignedIn(true);

        const { data } = await supabase
          .from("user")
          .select("*, playlist(*)")
          .eq("id", user.id)
          .single();

        if (data) {
          setUserProfile({
            ...data,
            isLoaded: true,
          });
          router.push("/");
        } else {
          router.push("/signup");
        }
      } catch (e) {
        router.push("/signin");
      }
    };
    validateUser();
  }, []);

  return (
    <WorkSpace>
      {pathname === "/signin" || isOAuthSignedIn ? (
        children
      ) : (
        <FullScreenLoading isTurnedOn={true} />
      )}
    </WorkSpace>
  );
}
