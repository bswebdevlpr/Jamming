"use client";

import * as Switch from "@radix-ui/react-switch";
import { Dispatch, SetStateAction, useState } from "react";

export default function RadixSwitch({
  value,
  setValue,
}: {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Switch.Root
      onCheckedChange={() => setValue(!value)}
      style={{
        width: "51px",
        height: "26px",
        backgroundColor: value ? "#0C7CFF" : "#444447",

        borderRadius: "9999px",
      }}>
      <Switch.Thumb
        style={{
          display: "block",
          width: "22px",
          height: "22px",
          backgroundColor: value ? "#FFF" : "#9F9FA2",

          borderRadius: "9999px",
          transition: "transform 200ms",
          transform: value ? "translateX(27px)" : "translateX(2px)",
          willChange: "transform",
        }}
      />
    </Switch.Root>
  );
}
