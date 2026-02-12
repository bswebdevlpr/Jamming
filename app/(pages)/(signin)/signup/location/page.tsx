"use client";

import { LocationEnum } from "@/app/lib/enums/location.enum";
import { BACKGROUND_IMAGES } from "@/app/lib/backgrounds";
import CompleteButton from "@/app/ui/buttons/complete";
import VerticalList from "@/app/ui/lists/list";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import createUser from "./actions";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { FormData_User, ZodSchema_User } from "@/app/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { useSessionStore } from "@/app/stores";
import { ErrorCode } from "@/app/lib/errors/custom-error";

export default function SignUp_Location() {
  // INIT
  const setUserProfile = useSessionStore((state) => state.setUserProfile);
  const signupProfileImage = useSessionStore((state) => state.signupProfileImage);
  const signupData = useSessionStore((state) => state.signupData);
  const clearSignupData = useSessionStore((state) => state.clearSignupData);

  const router = useRouter();
  //

  // STATES
  const [location, setLocation] = useState<LocationEnum>();
  const [error, setError] = useState<string>("");
  //

  // FORM
  const { handleSubmit, setValue, getValues } = useForm<FormData_User>({
    defaultValues: {
      nickname: signupData?.nickname || "",
      tags: signupData?.tags || [],
      pos: signupData?.pos,
      genre: signupData?.genre,
      level: signupData?.level,
      location,
      accept_marketing: signupData?.accept_marketing,
    },
    resolver: zodResolver(ZodSchema_User),
  });
  //

  // USE-EFFECTS
  useEffect(() => {
    // signupData가 없으면 profile 페이지로 리다이렉트
    if (!signupData) {
      router.push("/signup/profile");
    }
  }, [signupData, router]);

  useEffect(() => {
    if (location) setValue("location", location);
  }, [location, setValue]);
  //

  // HANDLER
  const onSubmit = async (data: FormData_User) => {
    if (!location) return;

    const result = await createUser(
      Object.assign(data, { profile_image: signupProfileImage })
    );

    if (result.success === true) {
      setUserProfile(result.data);
      clearSignupData();
      router.push("/", { scroll: false });
    } else if (result.success === false) {
      console.error("SignUp failed:", result.error.message);

      // 에러 타입별 처리
      const errorCode = result.error?.code;

      if (errorCode === ErrorCode.IMAGE_UPLOAD_FAILED) {
        // 이미지 업로드 실패: 현재 페이지에 머물기 (재시도 가능)
        setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      } else if (errorCode === ErrorCode.NICKNAME_NOT_UNIQUE) {
        // 닉네임 중복: 프로필 단계로 이동
        setError("이미 사용 중인 닉네임입니다.");
        setTimeout(() => {
          router.push("/signup/profile");
        }, 2000);
      } else if (
        errorCode === ErrorCode.VALIDATION_FAILED ||
        errorCode === ErrorCode.SECURITY_VIOLATION
      ) {
        // 입력값 검증 실패: 현재 페이지에 머물기
        setError(result.error.message || "입력값을 확인해주세요.");
      } else {
        // 기타 복구 불가능한 에러: 1단계로 이동
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
        setTimeout(() => {
          clearSignupData();
          router.push("/signup");
        }, 3000);
      }
    }
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
              backgroundUrl: BACKGROUND_IMAGES[typeForcedKey],
              style: {
                backgroundColor: "var(--background)",
              },
              onClick: () => setLocation(LocationEnum[typeForcedKey]),
            };
          })}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error("Validation failed:", errors);
          setError("잘못된 데이터가 입력되었습니다. 처음부터 다시 진행해주세요.");
          setTimeout(() => {
            router.push("/signup");
          }, 3000);
        })}
      >
        {error && (
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "14px",
              color: "#FF3E2F",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        <CompleteButton style={{ width: "100%" }} isActive={!!location} />
      </form>
    </div>
  );
}
