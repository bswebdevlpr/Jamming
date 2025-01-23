"use client";

import { Camera } from "@/app/ui/images/camera";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BottomSheetContent from "./(bottom-sheet)/content";
import { globalContext } from "../../../layout";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import { SignUp_Profile_Background_Genre } from "@/app/ui/images/signup/genre";
import { SignUp_Profile_Background_Level } from "@/app/ui/images/signup/level";
import { SignUp_Profile_Background_Position } from "@/app/ui/images/signup/position";
import NextButton_SignUp from "../buttons/next-button";
import Image from "next/image";
import { createClient } from "@/app/util/supabase/client";
import { validateNickname } from "@/app/api/functions/validation";

interface ImageFile {
  id: number;
  name: string;
  url: string;
}

const TextBox = ({
  upTxt,
  downTxt,
  moveTo,
  onClick,
}: {
  upTxt: string;
  downTxt: string;
  moveTo: string;
  onClick: (state: any) => void;
}) => {
  return (
    <div
      className="w-full h-20 absolute z-10 flex flex-col justify-between"
      style={{
        padding: "14px 16px 16px",
        transform: `translate(0px, ${moveTo})`,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "14px",
          color: "#E5E5E9",
        }}
      >
        {upTxt}
      </p>
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "14px",
          color: "#E5E5E9",
        }}
      >
        {downTxt}
      </p>
    </div>
  );
};

// ZOD
type FormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  profileInfo: z.custom<ImageFile>().nullable(),
  nickname: z
    .string()
    .min(1, { message: "닉네임을 입력해주세요" })
    .max(8, { message: "닉네임을 입력해주세요" })
    .regex(
      /^[a-zA-Z가-힣]+$/, // 알파벳, 숫자, 공백만 허용
      "올바른 닉네임을 입력해주세요"
    ),
  tags: z
    .array(z.string())
    .refine((arr) => arr.every((item) => /^#[가-힣a-zA-Z]+$/.test(item)), {
      message: "올바른 태그를 입력해주세요",
    }),
  position: z.nativeEnum(PositionEnum),
  genre: z.nativeEnum(GenreEnum),
  level: z.nativeEnum(LevelEnum),
});
//

export default function SignUp_Profile() {
  // INIT
  const { bottomSheet } = useContext(globalContext);
  //

  // STATES
  const [position, setPosition] = useState<PositionEnum>();
  const [genre, setGenre] = useState<GenreEnum>();
  const [level, setLevel] = useState<LevelEnum>();
  //

  // FORM
  const { register, handleSubmit, formState, watch, setValue, getValues } =
    useForm<FormData>({
      defaultValues: {
        nickname: "",
        tags: new Array(4).fill(""),
        position,
        genre,
        level,
      },
      resolver: zodResolver(formSchema),
    });

  const profileInfo = watch("profileInfo"),
    nickname = watch("nickname"),
    tags = watch("tags");
  //

  // USEEFFECT
  useEffect(() => {
    if (position) setValue("position", position);
  }, [position]);
  useEffect(() => {
    if (genre) setValue("genre", genre);
  }, [genre]);
  useEffect(() => {
    if (level) setValue("level", level);
  }, [level]);
  //

  // HANDLERS
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList) {
      const file = Array.from(fileList)[0];

      const newImage: ImageFile = {
        id: Date.now(), // 고유한 ID 생성
        name: file?.name,
        url: URL.createObjectURL(file), // 미리보기 URL 생성
      };
      setValue("profileInfo", newImage);
    }
  };

  const onSubmit = async (data: FormData) => {
    // await validateNickname(nickname);

    return false;
  };
  //

  return (
    <div className="h-full flex flex-col relative">
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "24px",
          color: "#C0C0C5",
          marginBottom: "18px",
        }}
      >
        프로필을 설정해주세요
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grow flex flex-col justify-between"
      >
        <div className="flex flex-col">
          <div className="flex flex-row justify-between min-w-full">
            <div
              style={{
                width: "53.24%", //"175.765px",
                height: "24.55vh", // "184.92px",
                backgroundColor: "#242426",
                clipPath: "polygon(0% 0%, 0% 100%, 85% 85%, 100% 0%)",

                position: "relative",
                flexShrink: 0,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full h-full absolute opacity-0 z-20"
                style={{
                  cursor: "pointer",
                }}
              />
              {profileInfo && (
                <Image
                  src={profileInfo.url}
                  alt="background"
                  fill={true}
                  className="absolute z-10"
                />
              )}
              <span
                className="inline-block"
                style={{
                  marginTop: "35.69%", // "66px",
                  marginLeft: "30.72%", // "54px",
                }}
              >
                <div className="flex flex-col items-center">
                  <Camera style={{ marginBottom: "6px" }} />
                  <p
                    style={{
                      fontFamily: "SUIT-BODY",
                      fontSize: "12px",
                    }}
                  >
                    프로필 사진
                  </p>
                </div>
              </span>
            </div>
            <div className="grow flex flex-col items-end relative">
              <div
                className="absolute z-10"
                style={{
                  width: "12.46%", // "16px",
                  height: "43%", //"76px",
                  backgroundColor: "#242426",
                  clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                  transform: "translate(-745%)", //"translate(-160px)",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  width: "93.22%",
                  height: "43%", // "76px",
                  backgroundColor: "#242426",
                  flexShrink: 0,
                  // clipPath:
                  //   "polygon(0% 0%, 0% 10.09vh, 42.66vw 10.09vh, 42.66vw 0vh)",
                  // "polygon(0px 0px, 0px 76px, 160px 76px, 160px 0px)",
                }}
              >
                <div
                  className="flex flex-col justify-between"
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "14px 16px 10px 16px",

                    fontFamily: "SUIT-BODY",
                    fontSize: "14px",
                  }}
                >
                  <p>
                    <span style={{ color: "#A3FF0C" }}>*</span>닉네임
                  </p>
                  {formState.errors.nickname && (
                    <p style={{ color: "red", fontSize: "10px" }}>
                      {formState.errors.nickname.message}
                    </p>
                  )}
                  <div className="flex flex-row justify-between">
                    <input
                      id="nickname"
                      type="text"
                      maxLength={8}
                      {...register("nickname")}
                      placeholder="입력"
                      className="w-full"
                      style={{
                        color: "#E5E5E9",
                        background: "#242426",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "SUIT-BODY",
                        fontSize: "12px",
                        color: "#767678",
                      }}
                    >
                      {nickname?.length ?? 0}/8
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col gap-3"
                style={{
                  width: "110%", //"171px",
                  height: "55.24%", //"100px",
                  padding: "14px 8px",
                }}
              >
                <p
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "14px",
                    color: "#E5E5E9",
                  }}
                >
                  나를 나타내는 태그
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#9F9FA2",
                    }}
                  >
                    (최대 4개)
                  </span>
                </p>
                <div
                  className="grid grid-cols-2 gap-0.5"
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "12px",
                    color: "#9F9FA2",
                  }}
                >
                  {tags.map((tag, idx) => (
                    <>
                      <style jsx key={idx}>{`
                        input::placeholder {
                          font-size: 12px;
                        }
                      }`}</style>
                      <input
                        type="text"
                        key={idx}
                        value={tag}
                        placeholder={idx === 2 ? "# 입력" : ""}
                        className="max-w-fit"
                        style={{
                          background: "var(--background)",
                          color: "var(--highlight)",
                          fontSize: "14px",
                        }}
                        onChange={(e) =>
                          setValue(
                            "tags",
                            tags.map((tag, innerIdx) =>
                              idx === innerIdx
                                ? e.target.value.startsWith("#")
                                  ? e.target.value
                                  : "#" + e.target.value
                                : tag
                            )
                          )
                        }
                      />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-full h-auto">
              <TextBox
                upTxt="포지션"
                downTxt="선택"
                moveTo="2.16vh"
                onClick={() =>
                  bottomSheet.set({
                    location: "high",
                    children: (
                      <BottomSheetContent
                        type="position"
                        state={position}
                        handleState={(value) => setPosition(value)}
                      />
                    ),
                  })
                }
              />
              <SignUp_Profile_Background_Position />
            </div>
            <div className="relative w-full h-auto">
              <TextBox
                upTxt="선호장르"
                downTxt="선택"
                moveTo="0px"
                onClick={() =>
                  bottomSheet.set({
                    location: "high",
                    children: (
                      <BottomSheetContent
                        type="genre"
                        state={genre}
                        handleState={(value) => setGenre(value)}
                      />
                    ),
                  })
                }
              />
              <SignUp_Profile_Background_Genre
                style={{
                  transform: "translate(0vw, -2.52vh)",
                }}
              />
            </div>
            <div className="relative w-full h-auto">
              <TextBox
                upTxt="레벨"
                downTxt="선택"
                moveTo="-2.25vh" //"-17px"
                onClick={() =>
                  bottomSheet.set({
                    location: "high",
                    children: (
                      <BottomSheetContent
                        type="level"
                        state={level}
                        handleState={(value) => setLevel(value)}
                      />
                    ),
                  })
                }
              />
              <SignUp_Profile_Background_Level
                style={{
                  transform: "translate(0vw, -5.44vh)",
                }}
              />
            </div>
          </div>
        </div>
        <NextButton_SignUp
          isActive={
            !!(
              nickname &&
              !formState.errors.nickname &&
              position &&
              genre &&
              level
            )
          }
          nextPath="location"
          queryObj={getValues()}
          onClick={onSubmit}
          type="submit"
        />
      </form>
    </div>
  );
}
