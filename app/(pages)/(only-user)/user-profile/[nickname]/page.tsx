"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
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
import { useParams, useRouter } from "next/navigation";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { getUserByNickname } from "./functions/fetch";
import { convertBPMToTempo } from "@/app/lib/functions/convert";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { MapDataToPosition } from "@/app/lib/maps/jam";
import { List_PlayList, ListItem_PlayList } from "@/app/ui/lists/playlist.list";
import BPMBar from "@/app/ui/bpm/bpm-bar";

export default function MyPage() {
  const { nickname } = useParams();
  const router = useRouter();

  // STATES
  const [isBPMPopupOn, setIsBPMPopupOn] = useState(false);

  const [targetUser, setTargetUser] = useState<Entity_User>(null);
  const [defaultProfileImagePath, setDefaultProfileImagePath] =
    useState<string>(null);
  //

  useEffect(() => {
    (async () => {
      const result = await getUserByNickname(nickname as string);
      if (result.success === false) {
        if (process.env.NODE_ENV === "development") console.error(result.error.message);
        router.back();
        return;
      }

      const foundTargetUser = result.data;
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
  }, [nickname]);

  return (
    <div className="grow flex flex-col items-center overflow-without-scroll px-5">
      <div className="w-full flex justify-between py-5 mb-1">
        <LeftArrowWhite onClick={() => router.back()} />
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
      <BPMBar user={targetUser} className="mt-7 mb-5.5" />
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
        <List_PlayList>
          {targetUser && targetUser.playlist && targetUser.playlist.length > 0 ? (
            targetUser.playlist.map((row, idx) => (
              <ListItem_PlayList key={idx} item={row} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-5">
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  color: "#9F9FA2",
                  lineHeight: "150%",
                  textAlign: "center",
                }}
              >
                등록된 곡이 없습니다
              </p>
            </div>
          )}
        </List_PlayList>
      </div>
      <BPMPopup
        isTurnedOn={isBPMPopupOn}
        turnOff={() => setIsBPMPopupOn(false)}
      />
    </div>
  );
}
