import {
  Entity_JamEntry,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import Kebap from "@/app/ui/images/menu/kebap";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import { Dispatch, SetStateAction } from "react";

export const MemberComponent = (
  idx: number,
  entry: Entity_JamEntry,
  setMembers: Dispatch<SetStateAction<Entity_JamEntry[]>>
) => {
  const { nickname, bpm, location, pos, genre, level } = entry.user;

  return (
    <div
      key={idx}
      className="flex py-4 gap-3 items-center"
      style={{
        borderBottom: "var(--border)",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "100px",
          background:
            "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
        }}
      />
      <div className="grow flex flex-row justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "1rem",
                color: "#FFF",
                textAlign: "center",
                lineHeight: "140%",
              }}
            >
              {nickname}
            </p>
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "1rem",
                color: "var(--highlight)",
                textAlign: "center",
                lineHeight: "140%",
              }}
            >
              {bpm} BPM
            </p>
          </div>
          <TagList
            tags={[
              <LocationTag key="location" text={location} />,
              <PositionTag key="pos" text={pos} />,
              <GenreTag key="genre" text={genre} />,
              <LevelTag key="level" text={level} />,
            ]}
          />
        </div>
        <Kebap />
      </div>
    </div>
  );
};
