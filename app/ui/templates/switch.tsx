"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";

export default function RadixSwitch() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Switch.Root
      onCheckedChange={() => setIsChecked(!isChecked)}
      style={{
        width: "51px",
        height: "26px",
        backgroundColor: isChecked ? "#0C7CFF" : "#444447",

        borderRadius: "9999px",
      }}
    >
      <Switch.Thumb
        style={{
          display: "block",
          width: "22px",
          height: "22px",
          backgroundColor: isChecked ? "#FFF" : "#9F9FA2",

          borderRadius: "9999px",
          transition: "transform 200ms",
          transform: isChecked ? "translateX(27px)" : "translateX(2px)",
          willChange: "transform",
        }}
      />
    </Switch.Root>
  );
}
