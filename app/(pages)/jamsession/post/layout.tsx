import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Kebap from "@/app/ui/images/jamsession/post/kebap";
import WorkSpace from "@/app/ui/layouts/workspace";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <WorkSpace>
      <div className="flex flex-row justify-between items-center px-4 py-3">
        <LeftArrowWhite />
        <Kebap />
      </div>
      {children}
      <div
        className="w-full flex justify-center items-center px-4 py-2"
        style={{
          backgroundColor: "#111113",
          borderTop: "1px solid #333335",
          boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.3)",
          position: "fixed",
          bottom: 0,
        }}
      >
        <ButtonTemplate
          text="JAM 참여 신청"
          style={{
            width: "100%",
            color: "#A3FF0C",
            border: "1px solid #A3FF0C",
            background: "#304313",
          }}
        />
      </div>
    </WorkSpace>
  );
}
