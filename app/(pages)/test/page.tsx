"use client";

import { VerticalListItem } from "@/app/ui/lists/item";
import { motion } from "framer-motion";
import MotionDiv from "./motiondiv";

export default function TestPage() {
  return (
    <div>
      Hola
      {/* <button
        style={{
          background: "#FFF",
        }}
      >
        Sample
      </button> */}
      {/* <VerticalListItem text="mucho" onClick={() => ""}></VerticalListItem> */}
      <MotionDiv></MotionDiv>
    </div>
  );
}
