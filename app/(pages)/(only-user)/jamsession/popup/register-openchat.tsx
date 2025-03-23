"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { ImageWithTxt } from "@/app/ui/templates/images";
import PopupTemplate from "@/app/ui/templates/popup";
import { useState } from "react";

export default function RegisterOpenchatPopup({
  isTurnedOn,
  turnOff,
  setOpenchat,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  setOpenchat: (url: string) => void;
}) {
  const [localOpenchat, setLocalOpenchat] = useState<string>("");

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex flex-col justify-between px-5">
      <ImageWithTxt
        image={<LeftArrowWhite onClick={turnOff} />}
        text="오픈채팅방 링크"
        className="gap-3 py-3"
        style={{
          color: "#FFF",
          fontFamily: "SUIT-TITLE",
          fontSize: "1.0625rem",
          lineHeight: "132%",
          letterSpacing: " -0.408px",
        }}
      />
      <style jsx>
        {`
          input::placeholder {
            color: #979798;
          }
        `}
      </style>
      <div className="grow">
        <input
          type="text"
          placeholder="카카오톡 오픈채팅방 링크를 입력해주세요."
          style={{
            width: "100%",
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            lineHeight: "152%",
            letterSpacing: "-0.336px",
          }}
        />
      </div>
      <ButtonTemplate
        text="완료"
        className="mb-2"
        onClick={() => {
          if (
            localOpenchat.length > 0 &&
            /^https:\/\/open\.kakao\.com/.test(localOpenchat)
          ) {
            setOpenchat(localOpenchat);
          } else {
            // TODO: 카카오톡 오픈채팅방 링크만 입력 가능하다고 경고메세지 띄우기
          }
        }}
      />
    </PopupTemplate>
  );
}
