"use client";

import { PositionEnum } from "@/app/lib/constants/position.enum";
import CompleteButton from "@/app/ui/buttons/complete";
import { RoundedCheckbox } from "@/app/ui/checkbox";
import { LeftArrow } from "@/app/ui/images/arrows";
import { Plus, Minus } from "@/app/ui/images/jamsession/popup/select-headcount";
import { ImageWithTxt } from "@/app/ui/templates/images";
import PopupTemplate from "@/app/ui/templates/popup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const FlexRow = ({
  left,
  right,
  onClickPlus,
  onClickMinus,
}: {
  left: string;
  right: string;
  onClickPlus: () => void;
  onClickMinus: () => void;
}) => {
  return (
    <div
      className="flex flex-row justify-between items-center px-5 py-5"
      style={{
        borderBottom: "1px solid #333335",
      }}
    >
      <p
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#DCDCDD",
        }}
      >
        {left}
      </p>
      <span className="flex flex-row items-center gap-3">
        <Minus onClick={onClickMinus} />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#D1D5DA",
          }}
        >
          {right}
        </p>
        <Plus onClick={onClickPlus} />
      </span>
    </div>
  );
};

export default function SelectHeadCountPopup({
  isTurnedOn,
  turnOff,
  headCnts,
  setHeadCnts,
  anyone,
  setAnyone,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  headCnts: number[];
  setHeadCnts: Dispatch<SetStateAction<number[]>>;
  anyone: boolean;
  setAnyone: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    setHeadCnts(new Array(6).fill(0));
  }, [anyone]);

  return (
    <PopupTemplate isTurnedOn={isTurnedOn}>
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex flex-col px-5">
          <ImageWithTxt
            image={<LeftArrow />}
            text="인원 선택"
            className="py-3 gap-3"
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1.06rem",
            }}
            onClick={turnOff}
          />
          <p
            className="pt-2 pb-4"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#FFF",
            }}
          >
            각 파트별 인원을 선택해주세요.
          </p>
        </div>
        <div className="grow flex flex-col">
          {Object.values(PositionEnum).map((position, idx) => (
            <FlexRow
              key={idx}
              left={position}
              right={headCnts[idx].toString()}
              onClickPlus={() => {
                if (!anyone) {
                  const newArr = [...headCnts];
                  newArr[idx] += 1;
                  setHeadCnts(newArr);
                }
              }}
              onClickMinus={() => {
                if (headCnts[idx] > 0 && !anyone) {
                  const newArr = [...headCnts];
                  newArr[idx] -= 1;
                  setHeadCnts(newArr);
                }
              }}
            />
          ))}
        </div>
        <div className="flex flex-col px-5">
          <ImageWithTxt
            image={
              <RoundedCheckbox
                thisState={anyone}
                onClick={() => setAnyone(!anyone)}
              />
            }
            text="상관없음"
            className="py-3.5"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              gap: "8px",
            }}
          />
          <CompleteButton
            isActive={anyone || headCnts.reduce((acc, cur) => acc + cur, 0) > 0}
            onClick={turnOff}
            className="my-2"
            style={{
              width: "100%",
              border: "1px solid #333335",
              background: "#242426",
              color: "#767678",
            }}
          />
        </div>
      </div>
    </PopupTemplate>
  );
}
