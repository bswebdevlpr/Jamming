"use client";

import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { useContext, useEffect, useState } from "react";
import { globalContext } from "../layout";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    session: { userProfile, setUserProfile },
  } = useContext(globalContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    // validation
    const validateUser = async () => {
      let redirectUrl = null;

      try {
        if (!userProfile.isLoaded) {
          await supabase.auth
            .getUser()
            .then(async ({ data: { user }, error }) => {
              if (!user || error) {
                await supabase.auth.signOut();
                await supabase.auth.initialize();
                redirectUrl = "/";
              } else {
                await supabase
                  .from("user")
                  .select()
                  .eq("id", user.id)
                  .single()
                  .then(async ({ data, error }) => {
                    if (!data || error) {
                      await supabase.auth.signOut();
                      await supabase.auth.initialize();
                      redirectUrl = "/";
                    } else setUserProfile({ ...data, isLoaded: true });
                  });
              }
            });
        }
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
  }, []);

  return <>{isLoading ? <FullScreenLoading isTurnedOn={true} /> : children}</>;
}
