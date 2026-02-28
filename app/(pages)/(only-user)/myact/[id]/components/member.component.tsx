"use client";

import {
  Entity_JamEntry,
  Entity_JamSession,
} from "@/app/lib/interfaces/entity.interface";
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
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import RadixAvatar from "@/app/ui/templates/avatar";

export const MemberComponent = (
  idx: number,
  jam: Entity_JamSession,
  entry: Entity_JamEntry,
  isMyJam: boolean,
  letOutMember: (entryId: number) => void,
  bottomSheet: BottomSheetContext,
  onClickRejam: Dispatch<SetStateAction<boolean>>,
  handleNoShow: (noShowState: boolean, entryId: number) => void,
  setRejamTargetUserId: (targetUserId: string) => void,
  onClickProfile: (nickname: string) => void
) => {
  const { nickname, bpm, location, pos, genre, level, profile_image } =
    entry.user;

  const isPast = moment(jam.created_at).isBefore(moment());

  return (
    <div
      key={idx}
      className="w-full flex py-4 gap-3 items-center"
      style={{
        borderBottom: "1px solid #323234",
      }}
    >
      <div
        style={{ cursor: nickname ? "pointer" : "default" }}
        onClick={() => nickname && onClickProfile(nickname)}
      >
        <RadixAvatar width={52} height={52} src={profile_image} pos={pos} />
      </div>
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
        {isMyJam && (
          <Kebap
            onClick={() => {
              setRejamTargetUserId(entry.user_id);
              bottomSheet.set({
                location: isPast ? "row-2" : "row-1",
                children: (
                  <BottomSheetContentTemplate_List
                    btnTxt="닫기"
                    onClose={() =>
                      bottomSheet.set({
                        location: "hidden",
                      })
                    }
                  >
                    {isPast ? (
                      <>
                        <p
                          className="text-center px-3 py-3.5"
                          style={{
                            borderBottom: "1px solid var(--border)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            onClickRejam(true);
                            bottomSheet.set({
                              location: "hidden",
                            });
                          }}
                        >
                          REJAM!
                        </p>
                        <p
                          className="text-center px-3 py-3.5 mb-2"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleNoShow(true, entry.id);
                            bottomSheet.set({
                              location: "hidden",
                            });
                          }}
                        >
                          노쇼 체크
                        </p>
                      </>
                    ) : (
                      <p
                        className="text-center px-3 py-3.5"
                        style={{
                          color: "#FF3E2F",
                          cursor: "pointer",
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
                    )}
                  </BottomSheetContentTemplate_List>
                ),
              });
            }}
          />
        )}
      </div>
    </div>
  );
};
