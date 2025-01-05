"use client";

import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  // useEffect(() => {
  //   if (session.status === "unauthenticated") redirect("/");
  // }, [session.status]);

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
