"use client";

import {
  LocationEnum,
  LocationBackgroundURL,
} from "@/app/lib/enums/location.enum";
import X from "@/app/ui/images/common/x";
import { ListItemProp } from "@/app/ui/lists/item";
import VerticalList from "@/app/ui/lists/list";
import { useEffect, useRef, useState } from "react";

const locations: ListItemProp[] = Object.keys(LocationEnum).map((key) => {
  const typeForcedKey: keyof typeof LocationEnum =
    key as keyof typeof LocationEnum;

  return {
    text: LocationEnum[typeForcedKey],
    backgroundUrl: LocationBackgroundURL[typeForcedKey],
    onClick: null,
    style: {
      backgroundColor: "var(--background)",
    },
  };
});

export default function LocationPopup({
  turnOn,
  turnOff,
  setLocation,
}: {
  turnOn: boolean;
  turnOff: () => void;
  setLocation: (location: LocationEnum) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = turnOn ? "flex" : "none";
    }
  }, [turnOn]);

  return (
    <div
      ref={ref}
      className="hidden absolute z-10 flex flex-col"
      style={{
        width: `${width}px`,
        height: `${height}px`,

        top: 0,
        left: 0,

        overflow: "auto",

        backgroundColor: "var(--background)",
      }}
    >
      <div
        className="flex flex-row justify-between w-full px-5 py-3 mb-3"
        style={{
          borderBottom: "1px solid #323234",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          지역 선택
        </p>
        <X onClick={turnOff} />
      </div>
      <VerticalList
        props={locations.map((prop) => {
          prop.onClick = () => {
            setLocation(prop.text as LocationEnum);
            turnOff();
          };
          return prop;
        })}
      />
    </div>
  );
}
