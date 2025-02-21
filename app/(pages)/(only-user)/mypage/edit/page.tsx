"use client";

import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { SquaredCheckbox } from "@/app/ui/checkbox";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import EditIcon from "@/app/ui/images/jamsession/post/edit";
import Love from "@/app/ui/images/love";
import CheckboxOnEditPage from "@/app/ui/images/mypage/edit/checkbox";
import {
  EditGrayIcon,
  EditLightGrayIcon,
} from "@/app/ui/images/mypage/edit/edits";
import RadixAvatar from "@/app/ui/templates/avatar";
import RadixSelect from "@/app/ui/templates/select";
import { CSSProperties, useState } from "react";

const FlexRow = ({
  tag,
  opt,
}: {
  tag: string;
  opt: {
    items: string[];
    color: string;
  };
}) => {
  return (
    <div
      className="flex justify-between items-center"
      style={{
        width: "230px",
        fontFamily: "SUIT-BODY",
        fontSize: "0.875rem",
        color: "#F2F2F4",
      }}
    >
      <p>{tag}</p>
      <RadixSelect items={opt.items} color={opt.color} />
    </div>
  );
};

export default function Edit() {
  const [isBPMChecked, setIsBPMChecked] = useState(false);

  return (
    <div className="grow flex flex-col items-center">
      <div className="w-full flex justify-between py-3 px-4 mb-1">
        <LeftArrowWhite />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          프로필 설정
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FF3773",
          }}
        >
          저장
        </p>
      </div>
      <div className="relative">
        <RadixAvatar src="/samples/mypage.svg" />
        <EditGrayIcon
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        />
      </div>
      <div
        className="flex gap-"
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "1.125rem",
          color: "#FFF",

          padding: "0px 12px 6px 15px",
          marginTop: "26px",
          marginBottom: "16px",

          borderBottom: "1px solid var(--border)",

          gap: "6px",
        }}
      >
        <p>사용자 1</p>
        <EditLightGrayIcon />
      </div>
      <div
        className="w-full flex flex-col"
        style={{
          padding: "0px 38px",
          marginBottom: "25px",
        }}
      >
        <div
          className="flex justify-between"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",

            marginBottom: "5px",
          }}
        >
          <p>
            BPM&nbsp;&nbsp;
            <span
              style={{
                color: "var(--highlight)",
              }}
            >
              114
            </span>
          </p>
          <p
            style={{
              color: "var(--highlight)",
            }}
          >
            Moderato
          </p>
        </div>
        <div className="h-2 flex relative">
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
      </div>
      <div
        className="flex gap-2"
        style={{
          marginBottom: "43px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#FFF",
          }}
        >
          BPM 공개
        </p>
        <CheckboxOnEditPage
          isClicked={isBPMChecked}
          onClick={() => setIsBPMChecked(!isBPMChecked)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <FlexRow
          tag="포지션"
          opt={{
            items: Object.values(PositionEnum),
            color: "#FF3773",
          }}
        />
        <FlexRow
          tag="장르"
          opt={{
            items: Object.values(GenreEnum),
            color: "#A3FF0C",
          }}
        />
        <FlexRow
          tag="지역"
          opt={{
            items: Object.values(LocationEnum),
            color: "#0C7CFF",
          }}
        />
        <FlexRow
          tag="레벨"
          opt={{
            items: Object.values(LevelEnum),
            color: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
}
