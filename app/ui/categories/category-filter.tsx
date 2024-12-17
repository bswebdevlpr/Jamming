"use client";

import { useContext } from "react";
import Age from "../images/categories/age";
import Genre from "../images/categories/genre";
import Level from "../images/categories/level";
import Location from "../images/categories/location";
import Position from "../images/categories/position";
import { globalContext } from "@/app/(pages)/layout";

export default function CategoryFilter() {
  const { bottomSheet } = useContext(globalContext);

  return (
    <div className="flex flex-row gap-4">
      <div
        onClick={() => {
          bottomSheet.setter({ location: "middle", children: null });
        }}
      >
        <Location />
      </div>
      <div>
        <Position />
      </div>
      <div>
        <Genre />
      </div>
      <div>
        <Level />
      </div>
      <div>
        <Age />
      </div>
    </div>
  );
}
