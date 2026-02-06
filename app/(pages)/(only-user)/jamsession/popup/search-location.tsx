"use client";

import { ZodType_LocationDetail } from "@/app/lib/zod";
import { RoundedCheckbox } from "@/app/ui/checkbox";
import { LeftArrow } from "@/app/ui/images/arrows";
import { SearchIcon } from "@/app/ui/images/jamsession/popup/search";
import ButtonTemplate from "@/app/ui/templates/buttons";
import PopupTemplate from "@/app/ui/templates/popup";
import axios from "axios";
import { useEffect, useState } from "react";

const FlexRow = ({
  dto,
  onClick,
  checkboxState,
}: {
  dto: ZodType_LocationDetail;
  onClick: (location: ZodType_LocationDetail | null) => void;
  checkboxState: boolean;
}) => {
  return (
    <div
      className="flex justify-between items-center px-4 py-3.5"
      style={{
        fontFamily: "SUIT-BODY",
        lineHeight: "132%",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <p
            style={{
              color: "#FFF",
              fontSize: "0.875rem",
              letterSpacing: "-0.336px",
            }}
          >
            {dto.name}
          </p>
          <p
            style={{
              color: "#979798",
              fontSize: "0.75rem",
              letterSpacing: "-0.288px",
            }}
          >
            {dto.category}
          </p>
        </div>
        <p
          style={{
            color: "#979798",
            fontSize: "0.75rem",
            letterSpacing: "-0.288px",
          }}
        >
          {dto.address}
        </p>
      </div>
      <RoundedCheckbox
        onClick={() => onClick(checkboxState ? null : dto)}
        thisState={checkboxState}
      />
    </div>
  );
};

export default function SearchLocationPopup({
  isTurnedOn,
  turnOff,
  setLocation,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  setLocation: (location: ZodType_LocationDetail) => void;
}) {
  const [searchTxt, setSearchTxt] = useState<string>("");
  const [data, setData] = useState<ZodType_LocationDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [localLocation, setLocalLocation] =
    useState<ZodType_LocationDetail>(null);
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>([]);

  const handleSearch = async () => {
    if (searchTxt)
      await axios
        .post("/api/naver/map", {
          location: searchTxt,
        })
        .then((res) => {
          setIsSearched(true);
          setData(res.data.data);
          setCheckboxStates(new Array(res.data.data.length).fill(false));
        });
  };

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex flex-col justify-between px-5"
    >
      <div className="w-full flex justify-between py-3 mb-4.5">
        <div className="grow flex gap-3">
          <LeftArrow onClick={turnOff} />
          <style jsx>
            {`
              input::placeholder {
                color: "#979798";
              }
            `}
          </style>
          <input
            type="text"
            placeholder="합주할 장소를 입력하세요."
            className="grow"
            style={{
              color: "#FFF",
              fontFamily: "SUIT-BODY",
              fontSize: "1.125rem",
              lineHeight: "132%",
              letterSpacing: "-0.408px",
            }}
            onChange={(e) => setSearchTxt(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>
        <SearchIcon onClick={handleSearch} style={{ marginLeft: "8px" }} />
      </div>

      <div className="grow flex flex-col">
        {isSearched ? (
          data.length > 0 ? (
            data.map((row, idx) => (
              <FlexRow
                key={idx}
                dto={row}
                onClick={(dto) => {
                  setLocalLocation(dto);
                  setCheckboxStates(
                    checkboxStates.map((val, innerIdx) =>
                      idx === innerIdx ? !val : val
                    )
                  );
                }}
                checkboxState={checkboxStates[idx]}
              />
            ))
          ) : (
            <p
              style={{
                color: "#FFF",
                fontFamily: "SUIT-BODY",
                fontSize: "1rem",
                lineHeight: "132%",
                letterSpacing: "-0.408px",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              검색 결과가 없습니다.
            </p>
          )
        ) : (
          <div
            className="flex flex-col gap-2"
            style={{
              color: "#C0C0C5",
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              lineHeight: "152%",
              letterSpacing: "-0.336px",
            }}
          >
            <p>주소와 함께 장소를 검색하면 더 정확한 결과를 알 수 있어요.</p>
            <p>예) 미금 언더그라운드 합주실</p>
          </div>
        )}
      </div>
      <ButtonTemplate
        text="완료"
        className="mb-2"
        isActive={!!localLocation}
        onClick={() => {
          setLocation(localLocation);
          turnOff();
        }}
        type="button"
      />
    </PopupTemplate>
  );
}
