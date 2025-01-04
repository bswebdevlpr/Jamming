"use client";

import { usePathname } from "next/navigation";
import { BlueNote, GrayNote, GreenNote, PinkNote } from "@/app/ui/images/note";
import { NextButton } from "@/app/ui/buttons/next";
import WorkSpace from "@/app/ui/layouts/workspace";
import ContentArea from "@/app/ui/layouts/content-area";

export default function Layout({ children }: { children: React.ReactNode }) {
  const splitedPath = usePathname().split("/");

  return (
    <WorkSpace>
      <ContentArea>
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
      </ContentArea>
    </WorkSpace>
  );
}
