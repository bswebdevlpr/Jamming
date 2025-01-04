"use client";

import WorkSpace from "@/app/ui/layouts/workspace";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") redirect("/");
  }, [session.status]);

  return (
    <WorkSpace>
      {session.status === "authenticated" ? (
        children
      ) : (
        <FullScreenLoading isTurnedOn={session.status === "loading"} />
      )}
    </WorkSpace>
  );
}
