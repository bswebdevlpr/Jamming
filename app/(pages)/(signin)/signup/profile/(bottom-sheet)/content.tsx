"use client";

import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import CancelButton from "@/app/ui/buttons/cancel";
import CompleteButton from "@/app/ui/buttons/complete";
import { CategoryFilterItem } from "@/app/ui/categories/items";
import Grid from "@/app/ui/grids/grid";
import Genre from "@/app/ui/images/categories/genre";
import Level from "@/app/ui/images/categories/level";
import Position from "@/app/ui/images/categories/position";
import { BOTTOMSHEET_HEIGHT_HIGH } from "@/app/ui/templates/bottom-sheet/body";
import { useEffect, useState } from "react";

export type BottomSheetContentType = null | "position" | "genre" | "level";

const BottomSheetContent = ({
  type,
  state,
  handleCancel,
  handleComplete,
  handleState,
}: {
  type: BottomSheetContentType;
  state: any;
  handleCancel: () => void;
  handleComplete: () => void;
  handleState: (value: any) => void;
}) => {
  const [localPosition, setLocalPosition] = useState<null | PositionEnum>(
    type === "position" ? state : null
  );
  const [localGenre, setLocalGenre] = useState<null | GenreEnum>(
    type === "genre" ? state : null
  );
  const [localLevel, setLocalLevel] = useState<null | LevelEnum>(
    type === "level" ? state : null
  );

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
            fontFamily: "Pretendard-SB",
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
      <CategoryFilterItem text={selectedCategory} className="py-2">
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
          items={thisEnum ? Object.values(thisEnum) : []}
          values={thisEnum ? Object.keys(thisEnum) : []}
          state={
            type === "position"
              ? localPosition
              : type === "genre"
              ? localGenre
              : type === "level"
              ? localLevel
              : null
          }
          handleState={(val) => {
            handleState(val);

            if (type === "position") setLocalPosition(val);
            else if (type === "genre") setLocalGenre(val);
            else if (type === "level") setLocalLevel(val);
          }}
        />
      </div>
      {/* 취소/완료 버튼 */}
      <div className="flex justify-center gap-2 mb-2">
        <CancelButton
          onClick={() => {
            handleState(state);
            if (type === "position") setLocalPosition(state);
            else if (type === "genre") setLocalGenre(state);
            else if (type === "level") setLocalLevel(state);
            handleCancel();
          }}
        />
        <CompleteButton onClick={handleComplete} />
      </div>
    </div>
  );
};

export default BottomSheetContent;
