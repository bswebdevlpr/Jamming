"use client";

import {
  LocationBackgroundURL,
  LocationEnum,
} from "@/app/lib/enums/location.enum";
import CompleteButton from "@/app/ui/buttons/complete";
import VerticalList from "@/app/ui/lists/list";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import createUser from "./actions";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { FormData_User, ZodSchema_User } from "@/app/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { base64ToFile } from "@/app/util/convert/file";
import { globalContext } from "@/app/(pages)/context";

export default function SignUp_Location() {
  // INIT
  const searchParams = useSearchParams();
  const queries = searchParams.entries().reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {} as { [key: string]: string });

  const { session } = useContext(globalContext);

  const router = useRouter();
  //

  // STATES
  const [location, setLocation] = useState<LocationEnum>();
  //

  // FORM
  const { handleSubmit, setValue, getValues } = useForm<FormData_User>({
    defaultValues: {
      nickname: queries.nickname,
      tags: queries.tags.split(","),
      pos: queries.pos as PositionEnum,
      genre: queries.genre as GenreEnum,
      level: queries.level as LevelEnum,
      location,
      accept_marketing:
        queries.accept_marketing === "true"
          ? true
          : queries.accept_marketing === "false"
          ? false
          : undefined,
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

    let profile_image = null;

    const profile_image_from_session = sessionStorage.getItem("profile_image");
    if (profile_image_from_session) {
      const { name, type, content } = JSON.parse(profile_image_from_session);
      profile_image = base64ToFile(content, name, type);
    }

    const ret = await createUser(Object.assign(data, { profile_image }))
      .then((newUserProfile) => {
        session.setUserProfile(newUserProfile);
        return true;
      })
      .catch((e) => {
        console.log(e);
        // TODO: 에러모달 - SignUp 에러
        return false;
      });

    if (ret) router.push("/jamsession", { scroll: false });
    else router.push("/signup");
  };
  //

  return (
    <div
      className="flex flex-col justify-between overflow-without-scroll"
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
              onClick: () => setLocation(LocationEnum[typeForcedKey]),
            };
          })}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, (e) => {
          // TODO: 에러모달 - 잘못된 데이터가 입력되었습니다. 처음부터 다시 진행해주세요.
          console.log(e);
          router.push("/signup");
        })}
      >
        <CompleteButton style={{ width: "100%" }} isActive={!!location} />
      </form>
    </div>
  );
}
