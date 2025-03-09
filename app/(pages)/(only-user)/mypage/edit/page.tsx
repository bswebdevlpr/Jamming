"use client";

import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import BPMBar from "@/app/ui/bpm/bpm-bar";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import CheckboxOnEditPage from "@/app/ui/images/mypage/edit/checkbox";
import {
  EditGrayIcon,
  EditLightGrayIcon,
} from "@/app/ui/images/mypage/edit/edits";
import RadixAvatar from "@/app/ui/templates/avatar";
import RadixSelect from "@/app/ui/templates/select";
import { useEffect, useState } from "react";
import { initialize } from "../functions/fetch";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToLocation,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import { useRouter } from "next/navigation";

const FlexRow = ({
  tag,
  opt,
}: {
  tag: string;
  opt: {
    items: string[];
    color: string;
    placeholder: string;
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
      <RadixSelect
        items={opt.items}
        color={opt.color}
        placeholder={opt.placeholder}
      />
    </div>
  );
};

export default function Edit() {
  const router = useRouter();

  // STATES
  const [isBPMChecked, setIsBPMChecked] = useState(false);
  const [user, setUser] = useState<Entity_User>(null);
  //

  // HANDLERS
  useEffect(() => {
    (async () => {
      const foundUser = await initialize();

      setUser(foundUser);
      setIsBPMChecked(foundUser.is_bpm_public);
    })();
  }, []);
  //

  return (
    <div className="grow flex flex-col items-center px-5">
      <div className="w-full flex justify-between py-3 mb-1">
        <LeftArrowWhite onClick={() => router.back()} />
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
          marginBottom: "40px",

          borderBottom: "1px solid var(--border)",

          gap: "6px",
        }}
      >
        <p>{user?.nickname}</p>
        <EditLightGrayIcon />
      </div>
      <BPMBar user={user} />
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
          isClicked={user?.is_bpm_public}
          onClick={() => setIsBPMChecked(!isBPMChecked)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <FlexRow
          tag="지역"
          opt={{
            items: Object.values(LocationEnum),
            color: "#0C7CFF",
            placeholder: MapDataToLocation[user?.location],
          }}
        />
        <FlexRow
          tag="포지션"
          opt={{
            items: Object.values(PositionEnum),
            color: "#FF3773",
            placeholder: MapDataToPosition[user?.pos],
          }}
        />
        <FlexRow
          tag="장르"
          opt={{
            items: Object.values(GenreEnum),
            color: "#A3FF0C",
            placeholder: MapDataToGenre[user?.genre],
          }}
        />
        <FlexRow
          tag="레벨"
          opt={{
            items: Object.values(LevelEnum),
            color: "#FFFFFF",
            placeholder: MapDataToLevel[user?.level],
          }}
        />
      </div>
    </div>
  );
}
