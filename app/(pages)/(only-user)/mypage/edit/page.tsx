"use client";

import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { CustomErrMsg, CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { ZodSchema_User } from "@/app/lib/zod";
import { isNicknameUnique } from "@/app/api/functions/validation";
import BPMBar from "@/app/ui/bpm/bpm-bar";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import CheckboxOnEditPage from "@/app/ui/images/mypage/edit/checkbox";
import {
  EditGrayIcon,
  EditLightGrayIcon,
} from "@/app/ui/images/mypage/edit/edits";
import RadixAvatar from "@/app/ui/templates/avatar";
import RadixSelect from "@/app/ui/templates/select";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
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

  // 프로필 이미지
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageThumbnail, setImageThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | undefined>(undefined);

  // 닉네임 편집
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const [nicknameStatus, setNicknameStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [nicknameError, setNicknameError] = useState<string | undefined>(undefined);
  const latestNicknameRef = useRef<string>("");
  //

  const cancelNicknameEdit = () => {
    setIsNicknameEditing(false);
    setNickname(undefined);
    setNicknameStatus("idle");
    setNicknameError(undefined);
  };

  // Object URL cleanup
  useEffect(() => {
    const currentThumbnail = imageThumbnail;
    return () => {
      if (currentThumbnail) URL.revokeObjectURL(currentThumbnail);
    };
  }, [imageThumbnail]);

  const handleImageCancel = () => {
    setImageFile(null);
    setImageThumbnail(null);
    setImageError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setImageError("10MB 이하의 이미지를 선택해주세요");
        event.target.value = "";
        return;
      }
      setImageError(undefined);
      setImageFile(file);
      setImageThumbnail(URL.createObjectURL(file));
    }
  };

  const debouncedNicknameCheck = useRef(
    _.debounce(async (value: string, currentNickname: string | undefined) => {
      // W2: 현재 닉네임과 동일하면 검사 불필요
      if (value === currentNickname) {
        setNicknameStatus("idle");
        setNicknameError(undefined);
        return;
      }

      setNicknameStatus("checking");
      setNicknameError(undefined);

      try {
        const isUnique = await isNicknameUnique(value);
        if (latestNicknameRef.current !== value) return;

        if (isUnique) {
          setNicknameStatus("valid");
        } else {
          setNicknameStatus("invalid");
          setNicknameError(CustomErrMsg.NicknameNotUnique);
        }
      } catch (e) {
        if (latestNicknameRef.current !== value) return;
        if (e instanceof CustomError && e.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
          setNicknameStatus("invalid");
          setNicknameError(e.userMessage);
        } else {
          setNicknameStatus("idle");
        }
      }
    }, 500),
  ).current;

  // Debounce cleanup
  useEffect(() => {
    return () => {
      debouncedNicknameCheck.cancel();
    };
  }, [debouncedNicknameCheck]);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    latestNicknameRef.current = value;

    if (!value || value.length === 0) {
      setNicknameStatus("idle");
      setNicknameError(undefined);
      debouncedNicknameCheck.cancel();
      return;
    }

    // W2: 현재 닉네임과 동일하면 즉시 idle로 (변경 없음)
    if (value === userProfile?.nickname) {
      setNicknameStatus("idle");
      setNicknameError(undefined);
      debouncedNicknameCheck.cancel();
      return;
    }

    const parseResult = ZodSchema_User.shape.nickname.safeParse(value);
    if (!parseResult.success) {
      setNicknameStatus("invalid");
      setNicknameError(parseResult.error.errors[0]?.message ?? "닉네임 형식이 올바르지 않습니다");
      debouncedNicknameCheck.cancel();
      return;
    }

    // W1: debounce 적용 (500ms)
    debouncedNicknameCheck(value, userProfile?.nickname);
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (nicknameStatus === "checking" || nicknameStatus === "invalid") {
      return;
    }

    const hasChanges =
      imageFile !== null ||
      (nickname !== undefined && nickname !== "" && nickname !== userProfile?.nickname) ||
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
      ...(nickname && nickname !== userProfile?.nickname && { nickname }),
      ...(imageFile && { profile_image: imageFile }),
    });

    if (result.success) {
      setUserProfile({
        ...(location && { location }),
        ...(pos && { pos }),
        ...(genre && { genre }),
        ...(level && { level }),
        is_bpm_public: isBPMChecked,
        ...(nickname && { nickname }),
        ...(result.data.profile_image && { profile_image: result.data.profile_image }),
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
        <RadixAvatar
          src={imageThumbnail ?? userProfile?.profile_image}
          pos={userProfile?.pos}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <EditGrayIcon
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 20,
            cursor: "pointer",
          }}
          onClick={() => fileInputRef.current?.click()}
        />
        {imageThumbnail && (
          <button
            onClick={handleImageCancel}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 20,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#323234",
              border: "1px solid var(--border)",
              color: "#9F9FA2",
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="이미지 선택 취소"
          >
            ✕
          </button>
        )}
      </div>
      {imageError && (
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#FF3773",
            marginTop: "6px",
          }}
        >
          {imageError}
        </p>
      )}
      <div
        className="flex items-center"
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
        {isNicknameEditing ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={nickname ?? userProfile?.nickname ?? ""}
              maxLength={8}
              autoFocus
              onChange={(e) => handleNicknameChange(e.target.value)}
              style={{
                background: "transparent",
                color: "#FFF",
                fontFamily: "SUIT-BODY",
                fontSize: "1.125rem",
                outline: "none",
                width: "120px",
              }}
            />
            {nicknameStatus === "checking" && (
              <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.625rem", color: "#9F9FA2" }}>
                확인 중...
              </p>
            )}
            {nicknameStatus === "valid" && (
              <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.625rem", color: "#A3FF0C" }}>
                사용 가능한 닉네임입니다
              </p>
            )}
            {nicknameError && (
              <p style={{ fontFamily: "SUIT-BODY", fontSize: "0.625rem", color: "#FF3773" }}>
                {nicknameError}
              </p>
            )}
          </div>
        ) : (
          <p>{nickname ?? userProfile?.nickname}</p>
        )}
        <EditLightGrayIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (isNicknameEditing) {
              cancelNicknameEdit();
            } else {
              setIsNicknameEditing(true);
            }
          }}
        />
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
