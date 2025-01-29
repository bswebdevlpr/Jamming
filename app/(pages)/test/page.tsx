"use client";

import { VerticalListItem } from "@/app/ui/lists/item";
import { motion } from "framer-motion";
import MotionDiv from "./motiondiv";
import CommuteRecordDateSlider from "@/app/ui/calendar/slide-calendar";

export default function TestPage() {
  return (
    <div>
      Hola
      <CommuteRecordDateSlider />
    </div>
  );
}
