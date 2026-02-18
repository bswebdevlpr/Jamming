"use client";

import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import InitButton from "@/app/ui/buttons/initialize";
import SelectButton from "@/app/ui/buttons/select";
import { CategoryFilterItem } from "@/app/ui/categories/items";
import Grid from "@/app/ui/grids/grid";
import Genre from "@/app/ui/images/categories/genre";
import Level from "@/app/ui/images/categories/level";
import Position from "@/app/ui/images/categories/position";
import { useEffect, useState } from "react";

const RecruitBottomSheetContent = ({
  genre,
  position,
  level,
  setGenre,
  setPosition,
  setLevel,
}: {
  genre?: GenreEnum;
  position?: PositionEnum;
  level?: LevelEnum;
  setGenre: (input: GenreEnum) => void;
  setPosition: (input: PositionEnum) => void;
  setLevel: (input: LevelEnum) => void;
}) => {
  // STATES
  const [localGenre, setLocalGenre] = useState<GenreEnum>(genre);
  const [localPosition, setLocalPosition] = useState<PositionEnum>(position);
  const [localLevel, setLocalLevel] = useState<LevelEnum>(level);

  const [activateSelect, setActivateSelect] = useState(false);

  // HANDLERS
  const handleGenre = (input: GenreEnum) => {
    setGenre(input);
    setLocalGenre(input);
  };
  const handlePosition = (input: PositionEnum) => {
    setPosition(input);
    setLocalPosition(input);
  };
  const handleLevel = (input: LevelEnum) => {
    setLevel(input);
    setLocalLevel(input);
  };

  useEffect(() => {
    if (localGenre || localPosition || localLevel)
      setActivateSelect(true);
    else setActivateSelect(false);
  }, [localGenre, localPosition, localLevel]);

  return (
    <div className="h-full flex flex-col justify-between pt-6 px-5">
      <div className="flex flex-col">
        <p
          className="pb-5"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#9F9FA2",
          }}
        >
          필터 선택
        </p>
        <div className="flex flex-col gap-6">
          {/* 장르 */}
          <div className="flex flex-col gap-3">
            <CategoryFilterItem text="장르">
              <Genre />
            </CategoryFilterItem>
            <Grid
              colNum={4}
              items={Object.values(GenreEnum)}
              values={Object.values(GenreEnum)}
              itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
              itemStyleActivated={{
                color: "#A3FF0C",
                border: "1px solid #A3FF0C",
                background: "rgba(163, 255, 12, 0.12)",
              }}
              state={localGenre}
              handleState={handleGenre}
            />
          </div>

          {/* 포지션 */}
          <div className="flex flex-col gap-3">
            <CategoryFilterItem text="포지션">
              <Position />
            </CategoryFilterItem>
            <Grid
              colNum={4}
              items={Object.values(PositionEnum)}
              values={Object.values(PositionEnum)}
              itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
              itemStyleActivated={{
                color: "#FF3773",
                border: "1px solid #FF3773",
                background: "rgba(255, 55, 115, 0.12)",
              }}
              state={localPosition}
              handleState={handlePosition}
            />
          </div>

          {/* 레벨 */}
          <div className="flex flex-col gap-3">
            <CategoryFilterItem text="레벨">
              <Level />
            </CategoryFilterItem>
            <Grid
              colNum={4}
              items={Object.values(LevelEnum)}
              values={Object.values(LevelEnum)}
              itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
              itemStyleActivated={{
                color: "#0C7CFF",
                border: "1px solid #0C7CFF",
                background: "rgba(0, 94, 203, 0.12)",
              }}
              state={localLevel}
              handleState={handleLevel}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center gap-2 pt-3">
        <InitButton
          onClick={() => {
            handleGenre(null);
            handlePosition(null);
            handleLevel(null);
          }}
        />
        <SelectButton isActive={activateSelect} />
      </div>
    </div>
  );
};
export default RecruitBottomSheetContent;
