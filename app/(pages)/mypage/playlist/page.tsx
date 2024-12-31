"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import MeatballMenu from "@/app/ui/images/menu/meatball";
import PlusPinkIcon from "@/app/ui/images/mypage/playlist/plus";
import SettingIcon from "@/app/ui/images/mypage/setting";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useState } from "react";
import Popup from "./popup";

const FlexRow = () => {
  return (
    <div
      className="relative flex flex-row items-center px-4 py-4 gap-3.5 overflow-auto"
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
      <MeatballMenu
        style={{
          marginLeft: "auto",
        }}
      />
    </div>
  );
};

export default function Playlist() {
  const [isPopupOn, setIsPopupOn] = useState(false);

  return (
    <div className="grow flex flex-col items-center overflow-auto">
      <div className="w-full flex justify-between py-5 px-4 mb-1">
        <LeftArrowWhite />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          내 연주 목록
        </p>
        <SettingIcon />
      </div>
      <div
        className="w-full flex flex-row px-4"
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
        }}
      >
        <p
          className="basis-1/2"
          style={{
            color: "#FFF",

            textAlign: "center",

            paddingTop: "18px",
            paddingBottom: "8px",
          }}
        >
          공개
        </p>
        <p
          className="basis-1/2"
          style={{
            color: "#C0C0C5",

            textAlign: "center",

            paddingTop: "20px",
            paddingBottom: "8px",
          }}
        >
          비공개
        </p>
      </div>
      <div className="w-full flex flex-row px-4 mb-6">
        <hr
          className="basis-1/2"
          style={{
            width: "100%",
            border: "none",
            borderTop: "4px solid var(--highlight)",
            borderRadius: "5px",
          }}
        />
        <hr
          className="basis-1/2"
          style={{
            width: "100%",
            border: "none",
            borderBottom: "1px solid var(--border)",
          }}
        />
      </div>
      <div className="w-full">
        <FlexRow />
        <FlexRow />
        <FlexRow />
        <FlexRow />
        <FlexRow />
        <FlexRow />
      </div>
      <ImageWithTxt
        image={<PlusPinkIcon />}
        text="업로드 하기"
        className="absolute pl-2.5 pr-4 py-2.5 gap-1"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #FF3773",
          borderRadius: "100px",

          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#FF3773",

          right: "16px",
          bottom: "88px",
        }}
        onClick={() => {
          setIsPopupOn(true);
        }}
      />
      <Popup isTurnedOn={isPopupOn} turnOff={() => setIsPopupOn(false)} />
    </div>
  );
}
