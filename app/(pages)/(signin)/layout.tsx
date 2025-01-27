"use client";

import ContentArea from "@/app/ui/layouts/content-area";
import WorkSpace from "@/app/ui/layouts/workspace";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { createClient } from "@/app/util/supabase/client";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        setIsSigned(false);
        redirect("/");
      } else setIsSigned(true);
    };
    validateUser();
  }, []);

  return (
    <WorkSpace>
      <ContentArea>
        {pathname === "/" || isSigned ? (
          children
        ) : (
          <FullScreenLoading isTurnedOn={true} />
        )}
      </ContentArea>
    </WorkSpace>
  );
}
