"use client";

import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import InitButton from "@/app/ui/buttons/initialize";
import SelectButton from "@/app/ui/buttons/select";
import { CategoryFilterItem } from "@/app/ui/categories/items";
import Grid from "@/app/ui/grids/grid";
import Genre from "@/app/ui/images/categories/genre";
import Level from "@/app/ui/images/categories/level";
import Location from "@/app/ui/images/categories/location";
import { useEffect, useState } from "react";

const BandBottomSheetContent = ({
  genre,
  level,
  location,
  setGenre,
  setLevel,
  setLocation,
}: {
  genre?: GenreEnum;
  level?: LevelEnum;
  location?: LocationEnum;
  setGenre: (input: GenreEnum) => void;
  setLevel: (input: LevelEnum) => void;
  setLocation: (input: LocationEnum) => void;
}) => {
  // STATES
  const [localGenre, setLocalGenre] = useState<GenreEnum>(genre);
  const [localLevel, setLocalLevel] = useState<LevelEnum>(level);
  const [localLocation, setLocalLocation] = useState<LocationEnum>(location);

  const [activateSelect, setActivateSelect] = useState(false);

  // HANDLERS
  const handleGenre = (input: GenreEnum) => {
    setGenre(input);
    setLocalGenre(input);
  };
  const handleLevel = (input: LevelEnum) => {
    setLevel(input);
    setLocalLevel(input);
  };
  const handleLocation = (input: LocationEnum) => {
    setLocation(input);
    setLocalLocation(input);
  };

  useEffect(() => {
    if (localGenre || localLevel || localLocation)
      setActivateSelect(true);
    else setActivateSelect(false);
  }, [localGenre, localLevel, localLocation]);

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
          {/* 지역 */}
          <div className="flex flex-col gap-3">
            <CategoryFilterItem text="지역">
              <Location />
            </CategoryFilterItem>
            <Grid
              colNum={4}
              items={Object.values(LocationEnum)}
              values={Object.values(LocationEnum)}
              itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
              itemStyleActivated={{
                color: "#3994FF",
                border: "1px solid #3994FF",
                background: "rgba(57, 148, 255, 0.12)",
              }}
              state={localLocation}
              handleState={handleLocation}
            />
          </div>

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
      <div className="w-full flex flex-row justify-center gap-2">
        <InitButton
          onClick={() => {
            handleGenre(null);
            handleLevel(null);
            handleLocation(null);
          }}
        />
        <SelectButton isActive={activateSelect} />
      </div>
    </div>
  );
};
export default BandBottomSheetContent;
