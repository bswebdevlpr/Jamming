"use client";

import { useRouter } from "next/navigation";
import { LeftArrowWhite } from "@/app/ui/images/arrows";

export default function AboutBackButton() {
  const router = useRouter();

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "20px",
        zIndex: 20,
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "rgba(17, 17, 19, 0.7)",
      }}
    >
      <LeftArrowWhite onClick={() => router.back()} />
    </div>
  );
}
