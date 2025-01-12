"use client";

import debounce from "@/app/lib/debounce";
import { NextButton } from "@/app/ui/buttons/next";
import { redirect, usePathname, useSearchParams } from "next/navigation";

export default function NextButton_SignUp({
  isActive,
  nextPath,
  queryObj,
}: {
  isActive: boolean;
  nextPath: string;
  queryObj: { [key: string]: string };
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex justify-center items-center">
      <NextButton
        isActive={isActive}
        onClick={() =>
          isActive &&
          debounce(
            redirect(
              `${pathname}/${nextPath}?${searchParams.toString()}${
                queryObj && new URLSearchParams(queryObj).toString()
              }`
            )
          )
        }
      />
    </div>
  );
}
