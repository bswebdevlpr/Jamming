"use client";

import {
  LocationBackgroundURL,
  LocationEnum,
} from "@/app/lib/constants/location.enum";
import { ListItemProp } from "@/app/ui/lists/item";
import VerticalList from "@/app/ui/lists/list";

const locations: Partial<ListItemProp>[] = Object.keys(LocationEnum).map(
  (key) => {
    const typeForcedKey: keyof typeof LocationEnum =
      key as keyof typeof LocationEnum;

    return {
      text: LocationEnum[typeForcedKey],
      backgroundUrl: LocationBackgroundURL[typeForcedKey],
      style: {
        backgroundColor: "var(--background)",
      },
    };
  }
);

export default function SignUp_Location() {
  return (
    <div className="flex flex-col relative">
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "23.5px",
          color: "#C0C0C5",

          marginBottom: "18px",
        }}
      >
        활동 가능한 지역을 선택해주세요
      </p>
      <hr
        style={{
          margin: "0 -20px 0 -20px",
          border: "none",
          borderTop: "1px solid var(--border)",
        }}
      />
      <VerticalList props={locations} />
    </div>
  );
}
