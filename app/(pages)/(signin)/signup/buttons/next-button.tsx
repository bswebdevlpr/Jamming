import debounce from "@/app/lib/debounce";
import { NextButton } from "@/app/ui/buttons/next";
import { redirect } from "next/navigation";

export function debouncedRedirect(
  nextPath: string,
  queryStr?: string,
  queryObj?: { [key: string]: any }
) {
  debounce(
    redirect(
      `${nextPath}?${queryStr ? queryStr : ""}${
        queryObj &&
        (queryStr ? "&" : "") + new URLSearchParams(queryObj).toString()
      }`
    )
  );
}

export default function NextButton_SignUp({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick?: (arg?: any) => any;
}) {
  return (
    <div className="flex justify-center items-center">
      <NextButton isActive={isActive} onClick={onClick} />
    </div>
  );
}
