"use client";

import { useRouter } from "next/navigation";
import Plus from "../images/jamsession/plus";

export default function JamNowPublic() {
  const router = useRouter();

  return (
    <div>
      <span
        className="flex justify-center items-center w-fit h-11 gap-1 pl-2.5 pr-4"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #A3FF0C",
          borderRadius: "6.25rem",
          position: "absolute",
          bottom: "var(--jam-now-bottom)",
          right: "var(--jam-now-right)",
          cursor: "pointer",
        }}
        onClick={() => router.push("/signin")}
      >
        <Plus />
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "0.875rem",
            color: "#A3FF0C",
            textAlign: "center",
            lineHeight: "normal",
            letterSpacing: "-0.336px",
            transform: "translateY(0.075rem)",
          }}
        >
          JAM NOW!
        </p>
      </span>
    </div>
  );
}
