"use client";

import { usePathname } from "next/navigation";
import { BlueNote, GrayNote, GreenNote, PinkNote } from "@/app/ui/images/note";

export default function Layout({ children }: { children: React.ReactNode }) {
  const splitedPath = usePathname().split("/");

  return (
    <div className="grow flex flex-col pt-9 px-5 pb-2 max-h-full">
      <span className="inline-block pb-5">
        <span className="flex flex-row basis-auto grow-0 shrink-0 gap-2.5 ">
          <GreenNote />
          {splitedPath.length > 2 ? <PinkNote /> : <GrayNote />}
          {splitedPath[2] === "location" ? <BlueNote /> : <GrayNote />}
        </span>
      </span>
      {children}
    </div>
  );
}
