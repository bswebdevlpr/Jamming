"use client";

import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { Camera } from "@/app/ui/images/camera";
import { SignUp_Profile_Background_Genre } from "@/app/ui/images/signup/genre";
import { SignUp_Profile_Background_Level } from "@/app/ui/images/signup/level";
import { SignUp_Profile_Background_Position } from "@/app/ui/images/signup/position";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import BottomSheetContent from "./(bottom-sheet)/content";

import { isNicknameUnique } from "@/app/api/functions/validation";
import { CustomErrMsg } from "@/app/lib/errors/custom-error";
import { FormData_User, ZodSchema_User, ZodType_Image } from "@/app/lib/zod";
import { logFormError } from "@/app/lib/functions/form";
import { useBottomSheetStore, useSessionStore } from "@/app/stores";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { motion } from "framer-motion";
import _ from "lodash";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TOP_OFFSET = 3.75;
const LEFT_OFFSET = 4.27;

const SECTION_1_HEIGHT = "32.22%";
const SECTION_2_HEIGHT = "33.33%";
const SECTION_3_TOP = "65.56%";
const SECTION_OVERLAP = "3vh";
const SECTION_LAST_OVERLAP = "3.5vh";

const TextBox = ({
  upTxt,
  downTxt,
  onClick,
  upTxtOffset = 0,
  downTxtOffset = 0,
}: {
  upTxt: string;
  downTxt: string;
  onClick: () => void;
  upTxtOffset?: number;
  downTxtOffset?: number;
}) => (
  <div
    className="absolute inset-0 z-10"
    style={{ cursor: "pointer" }}
    onClick={onClick}
  >
    <p
      style={{
        position: "absolute",
        top: `${TOP_OFFSET + upTxtOffset}vh`,
        left: `${LEFT_OFFSET}%`,
        fontFamily: "SUIT-BODY",
        fontSize: "14px",
        color: "#E5E5E9",
      }}
    >
      {upTxt}
    </p>
    <p
      style={{
        position: "absolute",
        top: `${TOP_OFFSET + 4 + downTxtOffset}vh`,
        left: `${LEFT_OFFSET}%`,
        fontFamily: "SUIT-BODY",
        fontSize: "14px",
        color: "#E5E5E9",
      }}
    >
      {downTxt}
    </p>
  </div>
);

const ProfileSection = ({
  containerStyle,
  textBoxProps,
  clipPath,
  backgroundImage,
}: {
  containerStyle: React.CSSProperties;
  textBoxProps: {
    upTxt: string;
    downTxt: string;
    onClick: () => void;
    upTxtOffset?: number;
    downTxtOffset?: number;
  };
  clipPath?: string;
  backgroundImage: React.ReactNode;
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      overflow: "hidden",
      ...containerStyle,
    }}
  >
    <TextBox {...textBoxProps} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...(clipPath ? { clipPath } : {}),
      }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        whileTap={{ scale: 1.07 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {backgroundImage}
      </motion.div>
    </div>
  </div>
);

export default function SignUp_Profile() {
  // INIT
  const bottomSheet = useBottomSheetStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  //

  // STATES
  const [position, setPosition] = useState<PositionEnum>();
  const [genre, setGenre] = useState<GenreEnum>();
  const [level, setLevel] = useState<LevelEnum>();

  const [profile_image, setProfileImage] = useState<ZodType_Image>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [nicknameStatus, setNicknameStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");

  // Zustand store
  const setSignupProfileImage = useSessionStore(
    (state) => state.setSignupProfileImage,
  );
  const setSignupData = useSessionStore((state) => state.setSignupData);

  // Race condition 방지용 ref
  const latestNicknameRef = useRef<string>("");
  //

  // FORM
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    setError,
    clearErrors,
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

  // clearErrors ref for debounce callback
  const clearErrorsRef = useRef(clearErrors);
  clearErrorsRef.current = clearErrors;

  // Debounce 닉네임 검증
  const debouncedCheckNickname = useRef(
    _.debounce(async (value: string) => {
      if (!value || value.length === 0) {
        setNicknameStatus("idle");
        return;
      }

      // Zod 형식 검증
      const nicknameSchema = ZodSchema_User.shape.nickname;
      const parseResult = nicknameSchema.safeParse(value);
      if (!parseResult.success) {
        setNicknameStatus("idle");
        return;
      }

      // 서버 중복 검사
      clearErrorsRef.current("nickname");
      setNicknameStatus("checking");
      try {
        const isUnique = await isNicknameUnique(value);
        if (latestNicknameRef.current !== value) return;

        if (isUnique) {
          setNicknameStatus("valid");
        } else {
          setNicknameStatus("invalid");
          setError("nickname", { message: CustomErrMsg.NicknameNotUnique });
        }
      } catch (e) {
        if (latestNicknameRef.current !== value) return;
        setNicknameStatus("idle");
        console.error("Nickname check failed:", e);
      }
    }, 500),
  ).current;
  //

  // USE-EFFECT
  useEffect(() => {
    const query = searchParams.get("accept_marketing");

    if (query !== null) {
      setValue("accept_marketing", query === "true");
    } else {
      // query가 없으면 기본값 false 설정
      setValue("accept_marketing", false);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (position) setValue("pos", position);
    if (genre) setValue("genre", genre);
    if (level) setValue("level", level);
  }, [position, genre, level, setValue]);

  useEffect(() => {
    latestNicknameRef.current = nickname;
    debouncedCheckNickname(nickname);

    return () => {
      debouncedCheckNickname.cancel();
    };
  }, [nickname]);

  // Object URL cleanup (메모리 누수 방지)
  useEffect(() => {
    // 이전 thumbnail 저장
    const currentThumbnail = profile_image?.thumbnail;

    return () => {
      // 컴포넌트 언마운트 또는 새 이미지 선택 시 이전 URL revoke
      if (currentThumbnail) {
        URL.revokeObjectURL(currentThumbnail);
      }
    };
  }, [profile_image?.thumbnail]);
  //

  // HANDLERS
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        setImageError("10MB 이하의 이미지를 선택해주세요");
        event.target.value = "";
        return;
      }

      setImageError(null);
      const newImage: ZodType_Image = {
        file,
        thumbnail: URL.createObjectURL(file),
      };
      setProfileImage(newImage);
    }
  };

  const onSubmit = async (data: FormData_User) => {
    try {
      // 실시간 검증 미완료 시 재검증
      if (nicknameStatus === "checking" || nicknameStatus === "idle") {
        const isUnique = await isNicknameUnique(data.nickname);
        if (!isUnique) {
          setNicknameStatus("invalid");
          setError("nickname", { message: CustomErrMsg.NicknameNotUnique });
          return;
        }
      }

      if (nicknameStatus === "invalid") {
        setError("nickname", { message: CustomErrMsg.NicknameNotUnique });
        return;
      }

      // Zustand store에 프로필 이미지 및 폼 데이터 저장
      if (profile_image) {
        setSignupProfileImage(profile_image.file);
      }
      setSignupData(data);

      // URL query string 없이 이동
      router.push(pathname.split("/").slice(0, 2).join("/") + "/location");
    } catch (e) {
      console.error("Profile submission failed:", e);
      setError("nickname", {
        message: e instanceof Error ? e.message : "프로필 저장에 실패했습니다.",
      });
    }
  };
  //

  return (
    <div className="grow min-h-0 flex flex-col relative overflow-without-scroll">
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
        className="grow flex flex-col"
        onSubmit={handleSubmit(onSubmit, (e) => {
          logFormError("signup-profile", e);
          // TODO: validation FAIL popup
        })}
      >
        <div className="grow flex flex-col min-h-0">
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
              {imageError && (
                <p
                  className="absolute z-30 bottom-2 left-2 right-2"
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "10px",
                    color: "#FF3E2F",
                  }}
                >
                  {imageError}
                </p>
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
                  {nicknameStatus === "checking" && (
                    <p
                      style={{
                        color: "#9F9FA2",
                        fontSize: "10px",
                        fontFamily: "SUIT-BODY",
                      }}
                    >
                      확인 중...
                    </p>
                  )}
                  {nicknameStatus === "valid" && !formState.errors.nickname && (
                    <p
                      style={{
                        color: "#A3FF0C",
                        fontSize: "10px",
                        fontFamily: "SUIT-BODY",
                      }}
                    >
                      사용 가능한 닉네임입니다
                    </p>
                  )}
                  {formState.errors.nickname && (
                    <p
                      style={{
                        color: "#FF3E2F",
                        fontSize: "10px",
                        fontFamily: "SUIT-BODY",
                      }}
                    >
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
                              : tag,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grow relative min-h-0">
            <ProfileSection
              containerStyle={{ top: 0, height: SECTION_1_HEIGHT, zIndex: 0 }}
              textBoxProps={{
                upTxt: "포지션",
                downTxt: position ?? "선택",
                onClick: () =>
                  bottomSheet.set({
                    location: "high",
                    children: (
                      <BottomSheetContent
                        type="position"
                        state={position}
                        handleState={(value) => setPosition(value)}
                      />
                    ),
                  }),
              }}
              clipPath="polygon(0 0, 100% 0, 100% calc(100% - 2vh), 0 100%)"
              backgroundImage={<SignUp_Profile_Background_Position />}
            />
            <ProfileSection
              containerStyle={{
                top: `calc(${SECTION_1_HEIGHT} - ${SECTION_OVERLAP})`,
                height: `calc(${SECTION_2_HEIGHT} + ${SECTION_OVERLAP})`,
                zIndex: 1,
              }}
              textBoxProps={{
                upTxt: "선호장르",
                downTxt: genre ?? "선택",
                onClick: () =>
                  bottomSheet.set({
                    location: "high",
                    children: (
                      <BottomSheetContent
                        type="genre"
                        state={genre}
                        handleState={(value) => setGenre(value)}
                      />
                    ),
                  }),
                upTxtOffset: 1.5,
                downTxtOffset: 2,
              }}
              clipPath="polygon(0 0, 100% 0, 100% calc(100% - 2vh), 0 100%)"
              backgroundImage={<SignUp_Profile_Background_Genre />}
            />
            <ProfileSection
              containerStyle={{
                top: `calc(${SECTION_3_TOP} - ${SECTION_LAST_OVERLAP})`,
                bottom: 0,
                zIndex: 2,
              }}
              textBoxProps={{
                upTxt: "레벨",
                downTxt: level ?? "선택",
                onClick: () =>
                  bottomSheet.set({
                    location: "high",
                    children: (
                      <BottomSheetContent
                        type="level"
                        state={level}
                        handleState={(value) => setLevel(value)}
                      />
                    ),
                  }),
                upTxtOffset: 3,
                downTxtOffset: 3.5,
              }}
              backgroundImage={<SignUp_Profile_Background_Level />}
            />
          </div>
        </div>
        <ButtonTemplate
          text="다음"
          className="mt-4"
          isActive={
            !!(
              nickname &&
              !formState.errors.nickname &&
              nicknameStatus !== "checking" &&
              nicknameStatus !== "invalid" &&
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
