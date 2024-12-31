"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Love from "@/app/ui/images/love";
import SettingIcon from "@/app/ui/images/mypage/setting";
import RadixAvatar from "@/app/ui/templates/avatar";
import Tag from "@/app/ui/templates/tag";
import BPMPopup from "./popup";
import { useState } from "react";
import { redirect } from "next/navigation";

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

  return (
    <div className="grow flex flex-col items-center overflow-without-scrollbar">
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
        <SettingIcon />
      </div>
      <RadixAvatar src="/samples/mypage.svg" />
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
        <p>사용자1</p>
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
        <Tag
          text="기타"
          style={{
            color: "#FF3773",
            background: "rgba(255, 55, 115, 0.24)",
          }}
        />
        <Tag
          text="헤비메탈"
          style={{
            color: "#A3FF0C",
            background: "rgba(163, 255, 12, 0.16)",
          }}
        />
        <Tag
          text="분당"
          style={{
            color: "#3994FF",
            background: "rgba(12, 124, 255, 0.20)",
          }}
        />
        <Tag
          text="프로"
          style={{
            color: "#E5E5E9",
            background: "#242426",
          }}
        />
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
        <div
          className="px-4"
          style={{
            paddingTop: "20px",
            paddingBottom: "7px",
          }}
        >
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",
            }}
          >
            피드백 보내기
          </p>
          <div className="relative">
            <textarea
              name=""
              id=""
              placeholder="재밍에 대한 의견을 자유롭게 입력해주세요"
              className="w-full mt-2.5 p-2.5"
              style={{
                height: "165px",

                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",

                backgroundColor: "#323234",
                borderRadius: "3px",
              }}
            />
            <p
              className="absolute"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",

                right: "10px",
                bottom: "10px",
              }}
            >
              0 / 100
            </p>
          </div>
        </div>
      </div>
      <BPMPopup
        isTurnedOn={isBPMPopupOn}
        turnOff={() => setIsBPMPopupOn(false)}
      />
    </div>
  );
}
