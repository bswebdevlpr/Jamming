"use client";

import {
  LocationBackgroundURL,
  LocationEnum,
} from "@/app/lib/constants/location.enum";
import CompleteButton from "@/app/ui/buttons/complete";
import { ListItemProp } from "@/app/ui/lists/item";
import VerticalList from "@/app/ui/lists/list";
import { useEffect, useState } from "react";

export default function SignUp_Location() {
  const [location, setLocation] = useState<LocationEnum>();

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div className="grow flex flex-col justify-between overflow-hidden">
      <div>
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
      </div>
      <div className="grow overflow-without-scroll">
        <VerticalList
          props={Object.keys(LocationEnum).map((key) => {
            const typeForcedKey: keyof typeof LocationEnum =
              key as keyof typeof LocationEnum;

            return {
              text: LocationEnum[typeForcedKey],
              backgroundUrl: LocationBackgroundURL[typeForcedKey],
              style: {
                backgroundColor: "var(--background)",
              },
              onClick: () => setLocation(LocationEnum[typeForcedKey]),
            };
          })}
        />
      </div>
      <CompleteButton
        style={{ width: "100%" }}
        isActive={!!location}
        onClick={() => {}}
      />
    </div>
  );
}
