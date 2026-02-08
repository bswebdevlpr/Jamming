"use client";

import { Entity_JamEntry } from "@/app/lib/interfaces/entity.interface";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { MapPositionToData } from "@/app/lib/maps/jam";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import RadixAvatar from "@/app/ui/templates/avatar";
import ButtonTemplate from "@/app/ui/templates/buttons";
import moment from "moment";
import { useState } from "react";
import { acceptRejam, rejectRejam } from "../functions/fetch";

export default function RejamInvitationCard({
  entry,
  onRemove,
}: {
  entry: Entity_JamEntry;
  onRemove: (entryId: number) => void;
}) {
  const jam = entry.jamsession;
  const host = jam?.user;

  const [step, setStep] = useState<"initial" | "select-pos">("initial");
  const [selectedPos, setSelectedPos] = useState<PositionEnum>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!selectedPos || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await acceptRejam(entry.id, MapPositionToData[selectedPos]);
      onRemove(entry.id);
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await rejectRejam(entry.id);
      onRemove(entry.id);
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!jam) return null;

  return (
    <div
      className="w-full flex flex-col p-4 mb-3"
      style={{
        backgroundColor: "#242426",
        borderRadius: "8px",
        border: "1px solid #323234",
      }}
    >
      {/* 호스트 정보 */}
      <div className="flex flex-row items-center gap-3 mb-3">
        <RadixAvatar
          width={36}
          height={36}
          src={host?.profile_image}
          pos={host?.pos}
        />
        <div>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#FFF",
            }}
          >
            {host?.nickname ?? "호스트"}
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
            }}
          >
            님의 초대
          </p>
        </div>
        <p
          className="ml-auto"
          style={{
            fontFamily: "SBAggroB",
            fontSize: "0.75rem",
            color: "#A3FF0C",
          }}
        >
          REJAM!
        </p>
      </div>

      {/* 잼 세션 정보 */}
      <div
        className="mb-3 pb-3"
        style={{ borderBottom: "1px solid #323234" }}
      >
        <p
          className="mb-2"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          {jam.title}
        </p>
        <TagList
          tags={[
            <LocationTag key="location" text={jam.location} />,
            <GenreTag key="genre" text={jam.genre} />,
            <LevelTag key="level" text={jam.level} />,
          ]}
        />
        <p
          className="mt-2"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
          }}
        >
          {moment(jam.datetime).format("YYYY.MM.DD")}
        </p>
      </div>

      {/* 어필 메시지 */}
      {entry.appeal && (
        <div
          className="mb-3 p-3"
          style={{
            backgroundColor: "#1a1a1c",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#C0C0C5",
              lineHeight: "140%",
            }}
          >
            &quot;{entry.appeal}&quot;
          </p>
        </div>
      )}

      {/* 포지션 선택 (2단계) */}
      {step === "select-pos" && (
        <div className="mb-3">
          <p
            className="mb-2"
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#FFF",
            }}
          >
            포지션 선택
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {Object.values(PositionEnum).map((val) => (
              <p
                key={val}
                className="px-2 py-1"
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.75rem",
                  lineHeight: "140%",
                  textAlign: "center",
                  borderRadius: "50px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",

                  ...(val === selectedPos
                    ? {
                        color: "#FF3773",
                        border: "1px solid #FF3773",
                        background: "rgba(255, 55, 115, 0.12)",
                      }
                    : {
                        color: "#FFF",
                        background: "#535355",
                        border: "1px solid #535355",
                      }),
                }}
                onClick={() => setSelectedPos(val)}
              >
                {val}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        {step === "initial" ? (
          <>
            <ButtonTemplate
              text="수락"
              className="basis-1/2"
              isActive
              onClick={() => setStep("select-pos")}
            />
            <ButtonTemplate
              text="거절"
              className="basis-1/2"
              onClick={handleReject}
            />
          </>
        ) : (
          <>
            <ButtonTemplate
              text="참여하기"
              className="basis-1/2"
              isActive={!!selectedPos && !isSubmitting}
              onClick={handleAccept}
            />
            <ButtonTemplate
              text="취소"
              className="basis-1/2"
              onClick={() => {
                setStep("initial");
                setSelectedPos(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
