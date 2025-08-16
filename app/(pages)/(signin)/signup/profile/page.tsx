"use client";

import { Camera } from "@/app/ui/images/camera";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BottomSheetContent from "./(bottom-sheet)/content";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { SignUp_Profile_Background_Genre } from "@/app/ui/images/signup/genre";
import { SignUp_Profile_Background_Level } from "@/app/ui/images/signup/level";
import { SignUp_Profile_Background_Position } from "@/app/ui/images/signup/position";
import { useDebouncedRedirect } from "../buttons/next-button";
import Image from "next/image";
import { isNicknameUnique } from "@/app/api/functions/validation";
import { CustomErrMsg } from "@/app/lib/errors/client.error";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormData_User, ZodSchema_User, ZodType_Image } from "@/app/lib/zod";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { readFileAsBase64 } from "@/app/util/convert/file";
import { globalContext } from "@/app/(pages)/context";

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

export default function SignUp_Profile() {
  // INIT
  const { bottomSheet } = useContext(globalContext);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  //

  // STATES
  const [position, setPosition] = useState<PositionEnum>();
  const [genre, setGenre] = useState<GenreEnum>();
  const [level, setLevel] = useState<LevelEnum>();

  const [profile_image, setProfileImage] = useState<ZodType_Image>(null);
  //

  // FORM
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    getValues,
    setError,
  } = useForm<FormData_User>({
    defaultValues: {
      accept_marketing: undefined,
      nickname: "",
      tags: new Array(4).fill(""),
      pos: position,
      genre,
      level,
    },
    resolver: zodResolver(ZodSchema_User),
  });

  const nickname = watch("nickname"),
    tags = watch("tags");
  //

  // USE-EFFECT
  useEffect(() => {
    const query = searchParams.get("accept_marketing");
    if (query === null) router.push("/signup");

    setValue("accept_marketing", Boolean(query));
  }, []);

  useEffect(() => {
    if (position) setValue("pos", position);
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

      const newImage: ZodType_Image = {
        file,
        thumbnail: URL.createObjectURL(file), // 미리보기 URL 생성
      };
      setProfileImage(newImage);
    }
  };

  const debouncedRedirect = useDebouncedRedirect(300);

  const onSubmit = async (data: FormData_User) => {
    try {
      if (!(await isNicknameUnique(data.nickname)))
        setError("nickname", { message: CustomErrMsg.NicknameNotUnique });
      else {
        if (profile_image)
          sessionStorage.setItem(
            "profile_image",
            JSON.stringify({
              name: profile_image.file.name,
              type: profile_image.file.type,
              content: await readFileAsBase64(profile_image.file),
            })
          );

        debouncedRedirect(
          pathname.split("/").slice(0, 2).join("/") + "/location",
          searchParams.toString(),
          getValues()
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  //

  return (
    <div className="h-full flex flex-col relative overflow-without-scroll">
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
        name="profile_form"
        className="grow flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmit, (e) => {
          console.log(e, getValues());
          console.error("validation failed");
          // TODO: validation FAIL popup
        })}
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
              {profile_image && (
                <Image
                  src={profile_image.thumbnail}
                  alt="profile image"
                  fill={true}
                  className="absolute z-10"
                  style={{
                    objectFit: "contain",
                  }}
                  sizes="100vw"
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
                  <style jsx>{`
                    input::placeholder {
                      font-size: 12px;
                    }
                  `}</style>
                  {tags.map((tag, idx) => (
                    <input
                      type="text"
                      key={idx}
                      value={tag}
                      placeholder={"# 입력"}
                      className="max-w-fit"
                      style={{
                        background: "var(--background)",
                        color: "var(--highlight)",
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
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-full h-auto">
              <TextBox
                upTxt="포지션"
                downTxt={position ?? "선택"}
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
                downTxt={genre ?? "선택"}
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
                downTxt={level ?? "선택"}
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
        <ButtonTemplate
          text="다음"
          isActive={
            !!(
              nickname &&
              !formState.errors.nickname &&
              position &&
              genre &&
              level
            )
          }
        />
      </form>
    </div>
  );
}
