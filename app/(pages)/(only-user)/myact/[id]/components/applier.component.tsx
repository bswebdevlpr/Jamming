import { Entity_JamEntry } from "@/app/lib/interfaces/entity.interface";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { Dispatch, SetStateAction } from "react";

export const ApplierComponent = (
  entry: Entity_JamEntry,
  setAppliers: Dispatch<SetStateAction<Entity_JamEntry[]>>
) => {
  const user = entry.user;

  return (
    <div className="flex flex-col gap-6 mt-3 mb-2">
      <div className="grow flex flex-row gap-4 items-center">
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "100px",
            background:
              "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
          }}
        />
        <div className="grow flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "1rem",
                color: "#FFF",
              }}
            >
              {user.nickname}
            </p>
            <TagList
              tags={[
                <LocationTag key="location" text={user.location} />,
                <PositionTag key="pos" text={user.pos} />,
                <GenreTag key="genre" text={user.genre} />,
                <LevelTag key="level" text={user.level} />,
              ]}
            />
          </div>
          {user.isRejam && (
            <p
              className="px-2 py-1"
              style={{
                width: "68px",
                height: "28px",

                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#A3FF0C",
                alignItems: "center",

                background: "#323234",
                borderRadius: "4px",
              }}
            >
              REJAM
            </p>
          )}
        </div>
      </div>
      <div className="gap-1">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#E5E5E9",
            lineHeight: "140%",
            letterSpacing: "-0.336px",
          }}
        >
          지원 포지션 : 기타
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}
        >
          한줄 소개가 들어갑니다. 한줄 소개가 들어갑니다.한줄 소개가
          들어갑니다.한줄 소개가 들어갑니다.
        </p>
      </div>
      <div className="flex flex-row gap-3">
        <ButtonTemplate
          text="거절"
          className="basis-1/2"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#FFF",

            background: "#323234",
            border: "1px solid #444447",
          }}
          onClick={() => {}}
        />
        <ButtonTemplate
          text="수락"
          className="basis-1/2"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#A3FF0C",

            border: "1px solid #A3FF0C",
          }}
        />
      </div>
    </div>
  );
};
