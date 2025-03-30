"use client";

import {
  LocationBackgroundURL,
  LocationEnum,
} from "@/app/lib/enums/location.enum";
import CompleteButton from "@/app/ui/buttons/complete";
import VerticalList from "@/app/ui/lists/list";
import { redirect, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import createUser from "./actions";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { FormData_User, ZodSchema_User } from "@/app/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { globalContext } from "@/app/(pages)/layout";
import { convertFormData } from "@/app/lib/functions/convert";

export default function SignUp_Location() {
  // INIT
  const searchParams = useSearchParams();
  const queries = searchParams.entries().reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {} as { [key: string]: string });

  const { session } = useContext(globalContext);
  //

  // STATES
  const [location, setLocation] = useState<keyof typeof LocationEnum>();
  //

  // FORM
  const { handleSubmit, setValue, getValues } = useForm<FormData_User>({
    defaultValues: {
      accept_marketing:
        queries.accept_marketing === "true"
          ? true
          : queries.accept_marketing === "false"
          ? false
          : undefined,
      nickname: queries.nickname,
      tags: queries.tags.split(","),
      position: queries.position,
      genre: queries.genre,
      level: queries.level,
      location,
    },
    resolver: zodResolver(ZodSchema_User),
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
    const createDto = convertFormData(data);
    //

    _.set(createDto, "pos", createDto.position);
    _.unset(createDto, "position");

    await createUser(createDto)
      .then((newUserProfile) => {
        session.setUserProfile(newUserProfile);
        redirect("/jamsession");
      })
      .catch(() => {
        // TODO: 에러모달 - SignUp 에러
        redirect("/signup");
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
          // TODO: 에러모달 - 잘못된 데이터가 입력되었습니다. 처음부터 다시 진행해주세요.
          redirect("/signup");
        })}>
        <CompleteButton style={{ width: "100%" }} isActive={!!location} />
      </form>
    </div>
  );
}
