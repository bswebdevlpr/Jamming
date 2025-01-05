"use client";

import { usePathname } from "next/navigation";
import { BlueNote, GrayNote, GreenNote, PinkNote } from "@/app/ui/images/note";
import WorkSpace from "@/app/ui/layouts/workspace";

export default function Layout({ children }: { children: React.ReactNode }) {
  const splitedPath = usePathname().split("/");

  return (
    <WorkSpace>
      <div className="grow flex flex-col px-4 pt-9 pb-2 overflow-without-scroll">
        <div className="mb-5">
          <span className="inline-block">
            <span className="flex flex-row basis-auto grow-0 shrink-0 gap-2.5 ">
              <GreenNote />
              {splitedPath.length > 2 ? <PinkNote /> : <GrayNote />}
              {splitedPath[2] === "location" ? <BlueNote /> : <GrayNote />}
            </span>
          </span>
        </div>
        {children}
      </div>
    </WorkSpace>
  );
}
