"use client";

import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { globalContext } from "../layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session } = useContext(globalContext);
  console.log("userProfile:", session.userProfile);

  useEffect(() => {
    const supabase = createClient();

    // validation
    const validate = async () => {
      let ret: boolean = false;

      const { data, error } = await supabase.auth.getSession();
      console.log("session:", data);
      if (!data || error) {
        await supabase.auth.signOut();
        await supabase.auth.initialize();
        redirect("/");
      } else if (!session.userProfile.isLoaded) {
        const { data: userProfile, error: userProfileError } = await supabase
          .from("user")
          .select()
          .eq("id", data.session.user.id)
          .single();
        console.log(userProfile, error);

        if (!userProfile || userProfileError) {
          await supabase.auth.signOut();
          await supabase.auth.initialize();
          redirect("/");
        }

        session.setUserProfile({ ...userProfile, isLoaded: true });
        ret = true;
      } else ret = true;

      return ret;
    };
    const valRes = validate();
    //

    let authListener;
    if (valRes) {
      const onAuth = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          redirect("/");
        }
      });
      authListener = onAuth.data;
    }

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {children}
      {/* {session.status === "authenticated" ? (
        children
      ) : (
        <FullScreenLoading isTurnedOn={session.status === "loading"} />
      )} */}
    </>
  );
}
