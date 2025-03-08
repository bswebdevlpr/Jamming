"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Love from "@/app/ui/images/love";
import RadixAvatar from "@/app/ui/templates/avatar";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import BPMPopup from "./popup";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { getUserByNickname } from "./functions/fetch";
import { convertBPMToTempo } from "@/app/lib/functions/convert";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { MapDataToPosition, MapPositionToData } from "@/app/lib/maps/jam";

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
  const { nickname } = useParams();

  // STATES
  const [isBPMPopupOn, setIsBPMPopupOn] = useState(false);

  const [targetUser, setTargetUser] = useState<Entity_User>(null);
  const [defaultProfileImagePath, setDefaultProfileImagePath] =
    useState<string>(null);
  //

  useEffect(() => {
    (async () => {
      const foundTargetUser = await getUserByNickname(nickname as string);
      setTargetUser(foundTargetUser);

      // TODO: 만약 유저 프로필 이미지가 있다면 하단 로직 생략
      const convertedPos = MapDataToPosition[foundTargetUser.pos];
      let imagePath = null;
      switch (convertedPos) {
        case PositionEnum.Guitar:
        case PositionEnum.Base:
          imagePath = "guitar-base";
          break;
        case PositionEnum.Drum:
          imagePath = "drum";
          break;
        case PositionEnum.Keyboard:
          imagePath = "keyboard";
          break;
        case PositionEnum.Vocal:
          imagePath = "vocal";
          break;
      }
      if (imagePath) imagePath += ".svg";
      setDefaultProfileImagePath(imagePath);
    })();
  }, []);

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
      <RadixAvatar src={defaultProfileImagePath} />
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
        <p>{targetUser?.nickname ?? "닉네임"}</p>
        <p>|</p>
        <p
          style={{
            color: "var(--highlight)",
          }}
        >
          {convertBPMToTempo(targetUser?.bpm) ?? "빠르기"}
        </p>
      </div>
      <TagList
        tags={[
          <LocationTag key="l" text={targetUser?.location ?? "지역"} />,
          <PositionTag key="p" text={targetUser?.pos ?? "포지션"} />,
          <GenreTag key="g" text={targetUser?.genre ?? "장르"} />,
          <LevelTag key="lv" text={targetUser?.level ?? "레벨"} />,
        ]}
      />
      <div
        className="w-full flex flex-col"
        style={{
          padding: "0px 38px",
          marginTop: "23px",
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
