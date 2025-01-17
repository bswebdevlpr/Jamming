"use client";

import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import InitButton from "@/app/ui/buttons/initialize";
import SelectButton from "@/app/ui/buttons/select";
import { CategoryFilterItem } from "@/app/ui/categories/items";
import Grid from "@/app/ui/grids/grid";
import Genre from "@/app/ui/images/categories/genre";
import Level from "@/app/ui/images/categories/level";
import Position from "@/app/ui/images/categories/position";
import { BOTTOMSHEET_HEIGHT_HIGH } from "@/app/ui/templates/bottom-sheet/body";
import { useState } from "react";

export type BottomSheetContentType = null | "position" | "genre" | "level";

const BottomSheetContent = ({
  type,
  state,
  handleState,
}: {
  type: BottomSheetContentType;
  state: any;
  handleState: (value: any) => void;
}) => {
  const [localState, setLocalState] = useState(state);

  const thisEnum =
    type === "position"
      ? PositionEnum
      : type === "genre"
      ? GenreEnum
      : type === "level"
      ? LevelEnum
      : null;

  const selectedCategory =
    type === "position"
      ? "포지션"
      : type === "genre"
      ? "장르"
      : type === "level"
      ? "레벨"
      : "";

  let itemColor, itemBackground;
  if (type === "position") {
    itemColor = "#FF3773";
    itemBackground = "rgba(255, 55, 115, 0.12)";
  } else if (type === "genre") {
    itemColor = "#A3FF0C";
    itemBackground = "rgba(163, 255, 12, 0.12)";
  } else if (type === "level") {
    itemColor = "#0C7CFF";
    itemBackground = "rgba(0, 94, 203, 0.12)";
  }
  const itemBorder = `1px solid ${itemColor}`;

  return (
    <div
      className="flex flex-col justify-between px-4"
      style={{
        height: `${BOTTOMSHEET_HEIGHT_HIGH}%`,
      }}
    >
      <div className="flex justify-center">
        <p
          style={{
            fontFamily: "Pretendard-600",
            fontSize: "20px",
            color: "#C0C0C5",
            marginTop: "20px",
            marginBottom: "15px",
          }}
        >
          {selectedCategory}
        </p>
        {/* {
            <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "12px",
            color: "#9F9FA2",
          }}
        >
          (최대 3개)
        </p>
        } */}
      </div>
      <CategoryFilterItem text={selectedCategory} className="pt-2 pb-3">
        {type === "position" ? (
          <Position />
        ) : type === "genre" ? (
          <Genre />
        ) : type === "level" ? (
          <Level />
        ) : null}
      </CategoryFilterItem>
      <div className="grow flex flex-col mb-7">
        {/* 선택사항들 */}
        <Grid
          colNum={4}
          items={thisEnum ? Object.values(thisEnum) : []}
          values={thisEnum ? Object.keys(thisEnum) : []}
          state={localState}
          handleState={(val) => {
            handleState(val);
            setLocalState(val);
          }}
          itemStyle={{
            fontFamily: "Pretendard-500",
          }}
          itemStyleActivated={{
            color: itemColor,
            border: itemBorder,
            background: itemBackground,
          }}
        />
      </div>
      {/* 취소/완료 버튼 */}
      <div className="flex justify-center gap-2 mb-2">
        <InitButton
          onClick={() => {
            handleState(null);
            setLocalState(null);
          }}
        />
        <SelectButton isActive={!!localState} state={localState} />
      </div>
    </div>
  );
};

export default BottomSheetContent;
