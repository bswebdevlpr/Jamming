"use client";

import WorkSpace from "@/app/ui/layouts/workspace";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { CustomError } from "@/app/lib/errors/client.error";
import { globalContext } from "../context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOAuthSignedIn, setIsOAuthSignedIn] = useState<boolean>(false);
  const { session } = useContext(globalContext);

  useEffect(() => {
    try {
      const validateUser = async () => {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!user || error) router.push("/");
        else {
          setIsOAuthSignedIn(true);

          const { data } = await supabase
            .from("user")
            .select()
            .eq("id", user.id)
            .single();

          if (data) {
            session.setUserProfile({
              ...data,
              isLoaded: true,
            });
            router.push("/jamsession");
          } else router.push("/signup");
        }
      };

      validateUser();
    } catch (e) {
      // TODO: 에러모달
      throw CustomError.InvalidUserSession;
    }
  }, []);

  return (
    <WorkSpace>
      {pathname === "/" || isOAuthSignedIn ? (
        children
      ) : (
        <FullScreenLoading isTurnedOn={true} />
      )}
    </WorkSpace>
  );
}
