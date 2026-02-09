"use client";

import { SquaredCheckbox } from "@/app/ui/checkbox";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import UserProfile from "@/app/ui/images/navbar/user-profile";
import ButtonTemplate from "@/app/ui/templates/buttons";
import PopupTemplate from "@/app/ui/templates/popup";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useEffect, useState } from "react";
import { getJamSchedule, sendRejam } from "../functions/fetch";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import moment from "moment";
import { REJAM_CONSTANTS } from "@/app/lib/constants/rejam";

const FlexRow = ({
  jam,
  checkedJamIds,
  setCheckedJamIds,
}: {
  jam: Entity_JamSession;
  checkedJamIds: number[];
  setCheckedJamIds: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div
      className="flex flex-col py-3"
      style={{
        borderBottom: "1px solid #323234",
      }}
    >
      <div className="flex flex-row gap-2 items-center mb-2">
        <SquaredCheckbox
          onClick={() => {
            setCheckedJamIds(
              checkedJamIds.includes(jam.id)
                ? checkedJamIds.filter((jam_id) => jam_id !== jam.id)
                : [...checkedJamIds, jam.id]
            );
          }}
        />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          {jam.title}
        </p>
      </div>
      <div className="flex flex-row gap-1 pl-7 mb-5">
        <TagList
          tags={[
            <LocationTag key="location" text={jam.location} />,
            <GenreTag key="genre" text={jam.genre} />,
            <LevelTag key="level" text={jam.level} />,
          ]}
        />
      </div>
      <div className="w-full flex flex-row justify-between pl-7">
        <ImageWithTxt
          image={<UserProfile width={10.7} height={12} />}
          text={
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              <span style={{ color: "#A3FF0C" }}>{jam.curHeadCnt}</span>/7
            </p>
          }
        />
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}
        >
          {moment(jam.datetime).format("YYYY.MM.DD")}
        </p>
      </div>
    </div>
  );
};

export default function RejamPopup({
  isTurnedOn,
  turnOff,
  rejamTargetUserId,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  rejamTargetUserId: string;
}) {
  const [jams, setJams] = useState<Entity_JamSession[]>([]);
  const [appeal, setAppeal] = useState<string>("");
  const [checkedJamIds, setCheckedJamIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rejamTargetUserId)
      (async () => {
        const result = await getJamSchedule(rejamTargetUserId);
        if (result.success === true) {
          setJams(result.data);
        } else if (result.success === false) {
          if (process.env.NODE_ENV === "development") console.error(result.error.message);
        }
      })();
  }, [rejamTargetUserId]);

  const handleSendRejam = async () => {
    if (checkedJamIds.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await sendRejam(rejamTargetUserId, checkedJamIds, appeal);
      if (result.success === true) {
        setCheckedJamIds([]);
        setAppeal("");
        turnOff();
      } else if (result.success === false) {
        alert(result.error.message);
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PopupTemplate isTurnedOn={isTurnedOn} className="flex flex-col">
      <div className="px-5">
        <ImageWithTxt
          image={<LeftArrowWhite onClick={turnOff} />}
          text="초대하기"
          className="gap-2 py-3"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        />
        <div className="my-3">
          <p
            style={{
              fontFamily: "SBAggroB",
              fontSize: "1.5rem",
              color: "#A3FF0C",
            }}
          >
            REJAM!
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#C0C0C5",
            }}
          >
            함께한 멤버와 한번더 잼세션을 하고싶으신가요? <br />
            내가 참여한 잼세션에 멤버를 초대할 수 있어요.
          </p>
        </div>
      </div>
      <div className="grow py-3 px-5 overflow-hidden">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1.125rem",
            color: "#C0C0C5",

            paddingBottom: "4px",
            borderBottom: "1px solid #323234",
          }}
        >
          잼 목록
        </p>
        <div
          style={{
            width: "100%",
            height: "95%",
            overflow: "auto",
          }}
        >
          {jams.map((jam, idx) => (
            <FlexRow
              key={idx}
              jam={jam}
              checkedJamIds={checkedJamIds}
              setCheckedJamIds={setCheckedJamIds}
            />
          ))}
          <div className="mt-6 mb-9 relative">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#E5E5E9",

                paddingBottom: "8px",
              }}
            >
              어필 한마디!
            </p>
            <style jsx>{`
              textarea::placeholder {
                color: "#767678";
              }
            `}</style>
            <textarea
              placeholder="입력"
              className="w-full px-3 py-2"
              maxLength={REJAM_CONSTANTS.MAX_APPEAL_LENGTH}
              value={appeal}
              style={{
                height: "72px",

                backgroundColor: "var(--background)",
                border: "1px solid #444447",
                borderRadius: "4px",

                fontFamily: "SUIT-BODY",
                color: "#FFF",
              }}
              onChange={(e) => setAppeal(e.currentTarget.value)}
            />
            <p
              className="absolute right-2 bottom-2"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#767678",
              }}
            >
              {appeal.length}/{REJAM_CONSTANTS.MAX_APPEAL_LENGTH}
            </p>
          </div>
        </div>
      </div>
      <div className="px-5">
        <ButtonTemplate
          text="LET'S JAM!"
          className="px-3 py-2.5 my-2"
          style={{
            fontFamily: "SBAggroM",
          }}
          styleActivated={{
            fontFamily: "SBAggroM",
          }}
          isActive={checkedJamIds.length > 0 && !isSubmitting}
          onClick={handleSendRejam}
        />
      </div>
    </PopupTemplate>
  );
}
