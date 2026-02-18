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
import { useState } from "react";
import { useSessionStore } from "@/app/stores";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToLocation,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import { useRouter } from "next/navigation";
import { updateProfile } from "./functions/update";

const FlexRow = ({
  tag,
  opt,
}: {
  tag: string;
  opt: {
    items: string[];
    color: string;
    placeholder: string;
    onValueChange?: (value: string) => void;
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
        onValueChange={opt.onValueChange}
      />
    </div>
  );
};

export default function Edit() {
  const router = useRouter();
  const userProfile = useSessionStore((state) => state.userProfile);
  const setUserProfile = useSessionStore((state) => state.setUserProfile);

  // STATES
  const [isBPMChecked, setIsBPMChecked] = useState(userProfile?.is_bpm_public ?? false);
  const [location, setLocation] = useState<LocationEnum | undefined>(undefined);
  const [pos, setPos] = useState<PositionEnum | undefined>(undefined);
  const [genre, setGenre] = useState<GenreEnum | undefined>(undefined);
  const [level, setLevel] = useState<LevelEnum | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  //

  const handleSave = async () => {
    if (isSaving) return;

    const hasChanges =
      location !== undefined ||
      pos !== undefined ||
      genre !== undefined ||
      level !== undefined ||
      isBPMChecked !== (userProfile?.is_bpm_public ?? false);

    if (!hasChanges) {
      router.back();
      return;
    }

    setIsSaving(true);
    setErrorMessage(undefined);

    const result = await updateProfile({
      location,
      pos,
      genre,
      level,
      is_bpm_public: isBPMChecked,
    });

    if (result.success) {
      setUserProfile({
        ...(location && { location }),
        ...(pos && { pos }),
        ...(genre && { genre }),
        ...(level && { level }),
        is_bpm_public: isBPMChecked,
      });
      router.back();
    } else if (result.success === false) {
      if (process.env.NODE_ENV === "development") console.error(result.error.message);
      setErrorMessage("저장에 실패했습니다. 다시 시도해주세요.");
      setIsSaving(false);
    }
  };

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
            color: isSaving ? "#9F9FA2" : "#FF3773",
            cursor: isSaving ? "default" : "pointer",
          }}
          onClick={handleSave}
        >
          {isSaving ? "저장 중..." : "저장"}
        </p>
      </div>
      <div className="relative">
        <RadixAvatar src={userProfile?.profile_image} pos={userProfile?.pos} />
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
        <p>{userProfile?.nickname}</p>
        <EditLightGrayIcon />
      </div>
      <BPMBar user={userProfile as Entity_User} />
      {errorMessage && (
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#FF3773",
            marginBottom: "8px",
          }}
        >
          {errorMessage}
        </p>
      )}
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
          tag="지역"
          opt={{
            items: Object.values(LocationEnum),
            color: "#0C7CFF",
            placeholder: MapDataToLocation[userProfile?.location],
            onValueChange: (v) => setLocation(v as LocationEnum),
          }}
        />
        <FlexRow
          tag="포지션"
          opt={{
            items: Object.values(PositionEnum),
            color: "#FF3773",
            placeholder: MapDataToPosition[userProfile?.pos],
            onValueChange: (v) => setPos(v as PositionEnum),
          }}
        />
        <FlexRow
          tag="장르"
          opt={{
            items: Object.values(GenreEnum),
            color: "#A3FF0C",
            placeholder: MapDataToGenre[userProfile?.genre],
            onValueChange: (v) => setGenre(v as GenreEnum),
          }}
        />
        <FlexRow
          tag="레벨"
          opt={{
            items: Object.values(LevelEnum),
            color: "#FFFFFF",
            placeholder: MapDataToLevel[userProfile?.level],
            onValueChange: (v) => setLevel(v as LevelEnum),
          }}
        />
      </div>
    </div>
  );
}
