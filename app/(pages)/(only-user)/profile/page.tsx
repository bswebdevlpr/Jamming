"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Love from "@/app/ui/images/love";
import SettingIcon from "@/app/ui/images/mypage/setting";
import RadixAvatar from "@/app/ui/templates/avatar";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
} from "@/app/ui/tags/category-tag";
import BPMPopup from "./popup";
import { useState } from "react";
import { redirect, usePathname } from "next/navigation";

const FlexRow = () => {
  return (
    <div
      className="flex flex-row items-center px-4 py-4 gap-3.5"
      style={{
        borderBottom: "1px solid #323234",
      }}
    >
      <div
        style={{
          width: "112px",
          height: "77px",
          backgroundColor: "#E5E5E9",
        }}
      />
      <div
        className="flex flex-col"
        style={{
          gap: "5px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          영상 제목
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#C0C0C5",
          }}
        >
          업로드 날짜 2024.09.25
        </p>
      </div>
    </div>
  );
};

export default function MyPage() {
  const [isBPMPopupOn, setIsBPMPopupOn] = useState(false);

  const pathname = usePathname();

  return (
    <div className="grow flex flex-col items-center overflow-without-scroll">
      <div className="w-full flex justify-between py-5 px-4 mb-1">
        <LeftArrowWhite />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          프로필
        </p>
        <div className="w-5 h-5" />
      </div>
      <RadixAvatar src={null} />
      <div
        className="flex gap-1.5"
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "1rem",
          color: "#FFF",

          marginTop: "22px",
          marginBottom: "16px",
        }}
      >
        <p>{"TEMP"}</p>
        <p>|</p>
        <p
          style={{
            color: "var(--highlight)",
          }}
        >
          Moderato
        </p>
      </div>
      <div
        className="flex flex-row gap-1"
        style={{
          marginBottom: "23px",
        }}
      >
        <PositionTag text="기타" />
        <GenreTag text="헤비메탈" />
        <LocationTag text="분당" />
        <LevelTag text="프로" />
      </div>
      <div
        className="w-full flex flex-col"
        style={{
          padding: "0px 38px",
          marginBottom: "22px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",

            marginBottom: "5px",
          }}
        >
          BPM&nbsp;&nbsp;
          <span
            style={{
              color: "var(--highlight)",
            }}
          >
            114
          </span>
        </p>
        <div className="h-2 flex relative mb-2.5">
          <div
            className="w-1/2 h-full"
            style={{
              backgroundColor: "var(--highlight)",
            }}
          />
          <div
            className="w-1/2 h-full"
            style={{
              backgroundColor: "#E5E5E9",
            }}
          />
          <Love
            className="absolute"
            style={{
              transform: "translate(140px, -10px) rotate(-20deg)",
            }}
          />
        </div>
        <div className="flex justify-end">
          <div
            className="grow-0 inline-flex gap-1 items-center"
            style={{
              fontFamily: "SUIT-BODY",
              color: "#C0C0C5",
              cursor: "pointer",
            }}
          >
            <p
              style={{
                width: "14px",
                height: "14px",

                fontSize: "0.625rem",

                border: "1.5px solid #9F9FA2",
                borderRadius: "50%",

                textAlign: "center",
                lineHeight: "14px",
              }}
            >
              ?
            </p>
            <p
              style={{
                fontSize: "0.75rem",
              }}
              onClick={() => setIsBPMPopupOn(true)}
            >
              what is BPM
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div
          className="flex justify-between px-4"
          style={{
            fontFamily: "SUIT-BODY",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              color: "#FFF",
            }}
          >
            연주 목록
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#C0C0C5",
            }}
            onClick={() => redirect("/mypage/playlist")}
          >
            더 보기
          </p>
        </div>

        <div>
          <FlexRow />
          <FlexRow />
          <FlexRow />
        </div>
      </div>
      <BPMPopup
        isTurnedOn={isBPMPopupOn}
        turnOff={() => setIsBPMPopupOn(false)}
      />
    </div>
  );
}
