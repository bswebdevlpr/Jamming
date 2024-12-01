"use client";

import { usePathname } from "next/navigation";
import { BlueNote, GrayNote, GreenNote, PinkNote } from "../ui/images/note";
import { NextButton } from "../ui/buttons/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const splitedPath = usePathname().split("/");

  return (
    <div className="flex flex-col justify-between pt-9 pb-2 min-w-full min-h-screen overflow-hidden">
      <div className="mb-5">
        <span className="inline-block">
          <span className="flex flex-row basis-auto grow-0 shrink-0 gap-2.5 ">
            <GreenNote />
            {splitedPath.length > 2 ? <PinkNote /> : <GrayNote />}
            {splitedPath[2] === "location" ? <BlueNote /> : <GrayNote />}
          </span>
        </span>
      </div>
      <div className="grow">{children}</div>
      <div className="flex justify-center items-center">
        <NextButton isActive={false} />
      </div>
    </div>
  );
}
