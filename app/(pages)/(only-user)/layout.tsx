"use client";

import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { globalContext } from "../context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    session: { userProfile, setUserProfile },
  } = useContext(globalContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let supabase = null;

    try {
      supabase = createClient();

      if (supabase) {
        // validation
        const validateUser = async () => {
          let redirectUrl = null;

          try {
            if (!userProfile.isLoaded)
              await supabase.auth
                .getUser()
                .then(async ({ data: { user }, error }) => {
                  if (!user || error) redirectUrl = "/";
                  else
                    await supabase
                      .from("user")
                      .select()
                      .eq("id", user.id)
                      .maybeSingle()
                      .then(async ({ data, error }) => {
                        if (!data || error) {
                          await supabase.auth.signOut();
                          redirectUrl = "/";
                        } else setUserProfile({ ...data, isLoaded: true });
                      });
                });
          } catch (e) {
            redirectUrl = "/";
          }

          if (redirectUrl) router.push(redirectUrl);
          else setIsLoading(false);
        };
        validateUser();
        //

        const onAuth = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_OUT") {
            router.push("/");
          }
        });
        const authListener = onAuth.data;

        return () => {
          authListener?.subscription.unsubscribe();
        };
      }
    } catch (e) {
      // TODO: 경고 로그인할 수 없음
      router.push("/");
    }
  }, []);

  return isLoading ? <FullScreenLoading /> : children;
}
