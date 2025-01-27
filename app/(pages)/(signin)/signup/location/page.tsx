"use client";

import {
  LocationBackgroundURL,
  LocationEnum,
} from "@/app/lib/constants/location.enum";
import CompleteButton from "@/app/ui/buttons/complete";
import VerticalList from "@/app/ui/lists/list";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import createUser from "./actions";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { FormData_User, FormSchema_User } from "@/app/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUp_Location() {
  // INIT
  const searchParams = useSearchParams();
  const queries = searchParams.entries().reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {} as { [key: string]: string });
  //

  // STATES
  const [location, setLocation] = useState<keyof typeof LocationEnum>();
  //

  // FORM
  const { handleSubmit, setValue, getValues } = useForm<FormData_User>({
    defaultValues: {
      acceptMarketing:
        queries.acceptMarketing === "true"
          ? true
          : queries.acceptMarketing === "false"
          ? false
          : undefined,
      nickname: queries.nickname,
      tags: queries.tags.split(","),
      position: queries.position,
      genre: queries.genre,
      level: queries.level,
      location,
    },
    resolver: zodResolver(FormSchema_User),
  });
  //

  // USE-EFFECTS
  useEffect(() => {
    if (location) setValue("location", location);
  }, [location]);
  //

  // HANDLER
  const onSubmit = async (data: FormData_User) => {
    if (!location) return;

    // DATA REFINING
    const createDto = data;

    Object.entries(createDto).forEach(([key, val]) => {
      if (key === "position" || key === "level")
        createDto[key] = (val as string).charAt(0).toLowerCase();
      else if (key === "genre") {
        const firstLetter = (val as string).charAt(0).toLowerCase();
        createDto[key] =
          firstLetter === "p"
            ? (val as string).slice(0, 2).toLowerCase()
            : firstLetter;
      } else if (key === "location")
        createDto[key] = (val as string)
          .split("")
          .filter((c) => 65 <= c.charCodeAt(0) && c.charCodeAt(0) <= 90)
          .map((val) => val.toLowerCase())
          .join("");
      else createDto[key] = val;
    });
    //

    _.set(createDto, "pos", createDto.position);
    _.unset(createDto, "position");

    await createUser(createDto)
      .then(() => {
        // TODO: refresh session data
        redirect("/jamsession");
      })
      .catch(() => {
        redirect("/");
      });
  };
  //

  return (
    <div
      className="flex flex-col justify-between"
      style={{
        height: "93.79%",
      }}>
      <div>
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "23.5px",
            color: "#C0C0C5",

            marginBottom: "18px",
          }}>
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
        }}>
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
      <form
        onSubmit={handleSubmit(onSubmit, (prop) => {
          // TODO: 데이터 validation해서 비정상 데이터이면 처음으로 redirect
        })}>
        <CompleteButton style={{ width: "100%" }} isActive={!!location} />
      </form>
    </div>
  );
}
