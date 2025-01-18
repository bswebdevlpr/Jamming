"use client";

import { GenreEnum } from "@/app/lib/constants/genre.enum";
import {
  LocationBackgroundURL,
  LocationEnum,
} from "@/app/lib/constants/location.enum";
import CompleteButton from "@/app/ui/buttons/complete";
import VerticalList from "@/app/ui/lists/list";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import createUser from "./actions";
import _ from "lodash";
import { useSession } from "next-auth/react";

export default function SignUp_Location() {
  const session = useSession();

  const searchParams = useSearchParams();

  const data: { [key: string]: any } = {};
  for (const [key, value] of searchParams.entries()) {
    let temp;

    if (key === "tags") temp = value.split(",");
    else if (key === "position" || key === "level")
      temp = value[0].toLowerCase();
    else if (key === "genre") {
      const firstLetter = value[0].toLowerCase();
      temp =
        firstLetter === "p" ? value.slice(0, 2).toLowerCase() : firstLetter;
    } else temp = value;

    console.log(key, value, temp);

    data[key === "position" ? "pos" : key] = temp;
  }
  console.log(data);

  const [location, setLocation] = useState<keyof typeof LocationEnum>();

  useEffect(() => {
    console.log("location", location);
    console.log(
      location
        ?.split("")
        .filter((c) => 65 <= c.charCodeAt(0) && c.charCodeAt(0) <= 90)
        .map((val) => val.toLowerCase())
        .join("")
    );
  }, [location]);

  return (
    <div
      className="flex flex-col justify-between"
      style={{
        height: "93.79%",
      }}
    >
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
      <div
        className="overflow-without-scroll"
        style={{
          height: "84.92%",
          margin: "0 -20px 0 -20px",
        }}
      >
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
              onClick: () => setLocation(typeForcedKey),
            };
          })}
        />
      </div>
      <CompleteButton
        style={{ width: "100%" }}
        isActive={!!location}
        onClick={() =>
          createUser({
            id: session.data.user.id,
            ...data,
            location: location
              ?.split("")
              .filter((c) => 65 <= c.charCodeAt(0) && c.charCodeAt(0) <= 90)
              .map((val) => val.toLowerCase())
              .join(""),
          })
        }
      />
    </div>
  );
}
