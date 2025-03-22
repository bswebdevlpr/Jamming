"use client";

import { DTO_Song } from "@/app/lib/interfaces/dto.interface";
import { LeftArrow } from "@/app/ui/images/arrows";
import { SearchIcon } from "@/app/ui/images/jamsession/popup/search";
import ButtonTemplate from "@/app/ui/templates/buttons";
import PopupTemplate from "@/app/ui/templates/popup";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const FlexRow = ({
  title,
  artist,
  albumCoverUrl,
  onClick,
}: DTO_Song & { onClick }) => {
  return (
    <div
      className="flex items-center py-3 gap-4"
      style={{
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Image
        src={albumCoverUrl}
        alt="cover image"
        width={52}
        height={52}
        priority={true}
      />
      <div className="flex flex-col gap-2">
        <p
          style={{
            color: "#FFF",
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            lineHeight: "normal",
            letterSpacing: "-0.384px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: "#A9ABAC",
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            lineHeight: "normal",
            letterSpacing: "-0.336px",
          }}
        >
          {artist}
        </p>
      </div>
    </div>
  );
};

export default function SearchSongPopup({
  isTurnedOn,
  turnOff,
  addNewSong,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  addNewSong: (input: DTO_Song) => void;
}) {
  const [searchTxt, setSearchTxt] = useState<string>("");
  const [data, setData] = useState<DTO_Song[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    if (searchTxt)
      await axios
        .post("/api/maniadb", {
          songName: searchTxt,
        })
        .then((res) => {
          setIsSearched(true);
          setData(res.data.data);
        });
  };

  useEffect(() => {
    if (searchTxt.length === 0) setData([]);
  }, [searchTxt]);

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex flex-col justify-between px-5"
    >
      <div className="w-full flex justify-between py-3">
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
            placeholder="노래 제목을 입력하세요"
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
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <SearchIcon onClick={handleSearch} style={{ marginLeft: "8px" }} />
      </div>
      <div className="grow flex flex-col ">
        {isSearched &&
          (data.length > 0 ? (
            data.map((row, idx) => (
              <FlexRow
                key={idx}
                albumCoverUrl={row.albumCoverUrl}
                title={row.title}
                artist={row.artist}
                onClick={addNewSong(row)}
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
          ))}
      </div>
    </PopupTemplate>
  );
}
