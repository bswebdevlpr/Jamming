"use client";

import { PositionEnum } from "@/app/lib/enums/position.enum";
import { MapDataToPosition } from "@/app/lib/maps/jam";
import { ZodType_HeadCnt } from "@/app/lib/zod";
import CompleteButton from "@/app/ui/buttons/complete";
import { LeftArrow } from "@/app/ui/images/arrows";
import { Plus, Minus } from "@/app/ui/images/jamsession/popup/select-headcount";
import { ImageWithTxt } from "@/app/ui/templates/images";
import PopupTemplate from "@/app/ui/templates/popup";
import _ from "lodash";
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
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  headCnts: ZodType_HeadCnt[];
  setHeadCnts;
}) {
  const [localHeadCnts, setLocalHeadCnts] = useState<ZodType_HeadCnt[]>(
    headCnts.map((row) => _.cloneDeep(row))
  );

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
            onClick={() => {
              setLocalHeadCnts(headCnts.map((row) => _.cloneDeep(row)));
              turnOff();
            }}
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
          {localHeadCnts.map((row, idx) => (
            <FlexRow
              key={idx}
              left={MapDataToPosition[row.pos]}
              right={row.headcnt.toString()}
              onClickPlus={() => {
                const newArr = [...localHeadCnts];
                newArr[idx].headcnt += 1;
                setLocalHeadCnts(newArr);
              }}
              onClickMinus={() => {
                if (row.headcnt > 0) {
                  const newArr = [...localHeadCnts];
                  newArr[idx].headcnt -= 1;
                  setLocalHeadCnts(newArr);
                }
              }}
            />
          ))}
        </div>
        <div className="flex flex-col px-5">
          <CompleteButton
            isActive={
              headCnts.reduce((acc, cur) => acc + cur.headcnt, 0) !==
              localHeadCnts.reduce((acc, cur) => acc + cur.headcnt, 0)
            }
            onClick={() => {
              setHeadCnts(localHeadCnts);
              turnOff();
            }}
            className="my-2"
            style={{
              width: "100%",
              border: "1px solid #333335",
              background: "#242426",
              color: "#767678",
            }}
            type="button"
          />
        </div>
      </div>
    </PopupTemplate>
  );
}
