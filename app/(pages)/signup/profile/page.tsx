"use client";

import BottomSheet from "@/app/ui/bottom-sheet/body";
import CancelButton from "@/app/ui/buttons/cancel";
import CompleteButton from "@/app/ui/buttons/complete";
import { NextButton } from "@/app/ui/buttons/next";
import { Camera } from "@/app/ui/images/camera";
import { BandType } from "@/app/ui/images/signup/band-type";
import { Genre } from "@/app/ui/images/signup/genre";
import { Position } from "@/app/ui/images/signup/position";
import SelectItem from "@/app/ui/grids/item";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BottomSheetContent, {
  BottomSheetContentType,
} from "./(bottom-sheet)/content";

const TextBox = ({
  upTxt,
  downTxt,
  moveTo,
  onClick,
}: {
  upTxt: string;
  downTxt: string;
  moveTo: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="w-full h-20 absolute z-10 flex flex-col justify-between"
      style={{
        padding: "14px 16px 16px",
        transform: `translate(0px, ${moveTo})`,
      }}
      onClick={onClick}
    >
      <p
        style={{
          fontFamily: "SUIT-Body",
          fontSize: "14px",
          color: "#E5E5E9",
        }}
      >
        {upTxt}
      </p>
      <p
        style={{
          fontFamily: "SUIT-Body",
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
  // STATE
  const [isPulledUp, setIsPulledUp] = useState(false);
  const [bottomSheetType, setBottomSheetType] =
    useState<BottomSheetContentType>(null);

  const handleIsPulledUp = (type?: BottomSheetContentType) => {
    setIsPulledUp(!isPulledUp);
    if (type) setBottomSheetType(type);
  };
  //

  // FORM
  // const formSchema = z.object({
  //   position: z.string().min(1, { message: "닉네임을 입력해주세요." }),
  //   genre: z.string().min(1, { message: "닉네임을 입력해주세요." }),
  //   bandType: z.string().min(1, { message: "닉네임을 입력해주세요." }),
  // });

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     nickname: "",
  //   },
  // });
  //

  return (
    <div className="flex flex-col relative">
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
      <div className="flex flex-col">
        <div className="flex flex-row justify-between min-w-full">
          <div
            style={{
              width: "175.765px",
              height: "184.92px",
              backgroundColor: "#242426",
              clipPath: "polygon(0% 0%, 0% 100%, 85% 85%, 100% 0%)",
            }}
          >
            <span
              className="inline-block"
              style={{
                marginTop: "66px",
                marginLeft: "54px",
              }}
            >
              <div className="flex flex-col items-center">
                <Camera style={{ marginBottom: "6px" }} />
                <p
                  style={{
                    fontFamily: "SUIT-Body",
                    fontSize: "12px",
                  }}
                >
                  프로필 사진
                </p>
              </div>
            </span>
          </div>
          <div className="flex flex-col items-end relative">
            <div
              className="absolute z-10"
              style={{
                width: "16px",
                height: "76px",
                backgroundColor: "#242426",
                clipPath: "polygon(16px 0px, 16px 76px, 0px 76px)",
                transform: "translate(-160px)",
              }}
            />
            <div
              style={{
                width: "160px",
                height: "76px",
                backgroundColor: "#242426",
                clipPath: "polygon(0px 0px, 0px 76px, 160px 76px, 160px 0px)",
              }}
            >
              <div
                className="flex flex-col justify-between"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "14px 16px 10px 16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "SUIT-Body",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#A3FF0C" }}>*</span>닉네임
                </p>
                <div className="flex flex-row justify-between">
                  <p
                    style={{
                      fontFamily: "SUIT-Body",
                      fontSize: "12px",
                      color: "#9F9FA2",
                    }}
                  >
                    입력
                  </p>
                  <p
                    style={{
                      fontFamily: "SUIT-Body",
                      fontSize: "12px",
                      color: "#767678",
                    }}
                  >
                    0/8
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col justify-between"
              style={{
                width: "171px",
                height: "100px",
                padding: "14px 8px",
              }}
            >
              <p
                style={{
                  fontFamily: "SUIT-Body",
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
              <p
                style={{
                  fontFamily: "SUIT-Body",
                  fontSize: "12px",
                  color: "#9F9FA2",
                }}
              >
                # 입력
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <TextBox
              upTxt="포지션"
              downTxt="선택"
              moveTo="16.32px"
              onClick={() => handleIsPulledUp("position")}
            />
            <Position />
          </div>
          <div className="relative">
            <TextBox
              upTxt="선호장르"
              downTxt="선택"
              moveTo="0px"
              onClick={() => handleIsPulledUp("genre")}
            />
            <Genre
              style={{
                transform: "translate(0px, -19px)",
              }}
            />
          </div>
          <div className="relative">
            <TextBox
              upTxt="밴드 유형"
              downTxt="선택"
              moveTo="-17px"
              onClick={() => handleIsPulledUp("bandType")}
            />
            <BandType
              style={{
                transform: "translate(0px, -41px)",
              }}
            />
          </div>
        </div>
      </div>
      {/* 바텀 시트 */}
      <BottomSheet pullUp={isPulledUp}>
        <BottomSheetContent
          type={bottomSheetType}
          handleCancel={() => handleIsPulledUp()}
          handleComplete={() => handleIsPulledUp()}
        />
      </BottomSheet>
    </div>
  );
}
