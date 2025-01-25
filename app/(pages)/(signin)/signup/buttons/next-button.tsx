"use client";

import debounce from "@/app/lib/debounce";
import { NextButton } from "@/app/ui/buttons/next";
import { redirect, usePathname, useSearchParams } from "next/navigation";

export default function NextButton_SignUp({
  isActive,
  nextPath,
  queryObj,
  type,
}: {
  isActive: boolean;
  nextPath: string;
  queryObj: { [key: string]: any };
  type?: "submit" | "reset" | "button" | undefined;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <div className="flex justify-center items-center">
      <NextButton
        isActive={isActive}
        onClick={() => {
          console.log("inside onClick, isActive:", isActive);
          if (isActive) {
            // debounce(
            //   redirect(
            //     `${nextPath}?${query.length > 0 ? query : ""}${
            //       queryObj &&
            //       (query.length > 0 ? "&" : "") +
            //         new URLSearchParams(queryObj).toString()
            //     }`
            //   )
            // );
            console.log("will be redirected");
          }
        }}
        type={type}
      />
    </div>
  );
}
