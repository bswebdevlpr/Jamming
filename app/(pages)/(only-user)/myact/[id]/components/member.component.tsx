"use client";

import { Entity_JamEntry } from "@/app/lib/interfaces/entity.interface";
import { BottomSheetContext } from "@/app/lib/interfaces/global.interface";
import Kebap from "@/app/ui/images/menu/kebap";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import BottomSheetContentTemplate_List from "@/app/ui/templates/bottom-sheet/contents/list";
import { refuseEntry } from "../functions/fetch";

export const MemberComponent = (
  idx: number,
  bottomSheet: BottomSheetContext,
  entry: Entity_JamEntry,
  letOutMember: (entryId: number) => void
) => {
  const { nickname, bpm, location, pos, genre, level } = entry.user;

  return (
    <div
      key={idx}
      className="w-full flex py-4 gap-3 items-center"
      style={{
        borderBottom: "1px solid #323234",
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
        <Kebap
          onClick={() =>
            bottomSheet.set({
              location: "row-1",
              children: (
                <BottomSheetContentTemplate_List
                  btnTxt="닫기"
                  onClose={() =>
                    bottomSheet.set({
                      location: "hidden",
                    })
                  }
                >
                  <p
                    className="text-center px-3 py-3.5"
                    style={{
                      color: "#FF3E2F",
                    }}
                    onClick={() =>
                      refuseEntry(entry.id).then(() => {
                        letOutMember(entry.id);
                        bottomSheet.set({
                          location: "hidden",
                        });
                      })
                    }
                  >
                    내보내기
                  </p>
                </BottomSheetContentTemplate_List>
              ),
            })
          }
        />
      </div>
    </div>
  );
};
