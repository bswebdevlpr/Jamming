"use client";

import { RightArrow } from "@/app/ui/images/arrows";
import X from "@/app/ui/images/common/x";
import {
  Gallery,
  Location,
  MusicNote,
  OpenChat,
} from "@/app/ui/images/jamsession/popup/create-jam";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import BottomSheetContent from "../bottom-sheet/content";
import { ImageWithTxt } from "@/app/ui/templates/images";
import SelectHeadCountPopup from "./select-headcount";
import { globalContext } from "@/app/(pages)/layout";
import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import ClockPopup from "./clock";
import moment from "moment";

const FlexRow = ({
  left,
  right,
  onClick,
}: {
  left: string;
  right: string;
  onClick?: any;
}) => {
  useEffect(() => {
    console.log("right:", right);
  }, [right]);

  return (
    <div
      className="flex flex-row justify-between items-center px-5 py-2"
      style={{
        height: "6.9%",
        borderBottom: "1px solid #333335",
      }}
      onClick={onClick}
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
      <span className="flex flex-row gap-2 cursor-pointer">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#DCDCDD",
            opacity: 0.6,
          }}
        >
          {right}
        </p>
        <RightArrow className="ml-auto" />
      </span>
    </div>
  );
};

export default function CreateJam({
  isTurnedOn,
  turnOff,
  selectedDate,
  setSelectedDate,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
}) {
  // GLOBAL
  const { bottomSheet } = useContext(globalContext);
  //

  const ref = useRef<HTMLDivElement>(null);

  // SATES
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [isHeadCountPopupTurnedOn, setIsHeadCountPopupTurnedOn] =
    useState(false);
  const [isClockPopupTurnedOn, setIsClockPopupTurnedOn] = useState(false);

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);

  const [headCnts, setHeadCnts] = useState<number[]>(new Array(6).fill(0));
  //

  useEffect(() => {
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);

  useEffect(() => {
    console.log("at create jam, selectedDate:", selectedDate);
  }, [selectedDate]);

  return (
    <div
      ref={ref}
      className="hidden absolute z-10 flex flex-col justify-between"
      style={{
        width: `${width}px`,
        height: `${height}px`,

        top: 0,
        left: 0,

        overflow: "auto",

        backgroundColor: "var(--background)",
      }}
    >
      <div
        className="flex flex-row justify-between py-3 px-5"
        style={{
          borderBottom: "1px solid #333335",
        }}
      >
        <X onClick={turnOff} />
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          JAM NOW!
        </p>
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "#A3FF0C",
          }}
          onClick={turnOff}
        >
          완료
        </p>
      </div>
      <div className="grow flex flex-col">
        <FlexRow
          left="카테고리"
          right="선택"
          onClick={() =>
            bottomSheet.set({
              location: "high",
              children: (
                <BottomSheetContent
                  genre={genre}
                  position={position}
                  level={level}
                  setGenre={setGenre}
                  setPosition={setPosition}
                  setLevel={setLevel}
                />
              ),
            })
          }
        />
        <FlexRow
          left="참여 인원"
          right={headCnts.reduce((acc, cur) => acc + cur, 0).toString()}
          onClick={() => setIsHeadCountPopupTurnedOn(true)}
        />
        <FlexRow
          left="날짜"
          right={
            selectedDate
              ? selectedDate.format("YYYY.MM.DD HH:mm")
              : "0000.00.00 00:00"
          }
          onClick={() => setIsClockPopupTurnedOn(true)}
        />
        <div className="flex flex-col gap-5 px-5 pt-7 overflow-without-scroll">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",
              opacity: 0.5,
            }}
          >
            제목을 입력하세요.
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#FFF",
              opacity: 0.5,
            }}
          >
            즐거운 잼세션을 위한 모집글을 적어주세요.
          </p>
        </div>
      </div>
      <div
        className="flex flex-row px-5 py-2 gap-3"
        style={{
          height: "6.37%",

          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          fontFeatureSettings: "'liga' off, 'clig' off",
          color: "#FFF",
          lineHeight: "normal",
          letterSpacing: "-0.336px",

          borderTop: "1px solid #333335",
          borderBottom: "1px solid #333335",
        }}
      >
        <ImageWithTxt
          image={<MusicNote />}
          text="합주곡"
          style={{ opacity: 0.6 }}
        />
        <ImageWithTxt
          image={<Gallery />}
          text="사진"
          style={{ opacity: 0.6 }}
        />
        <ImageWithTxt
          image={<Location />}
          text="장소"
          style={{ opacity: 0.6 }}
        />
        <ImageWithTxt
          image={<OpenChat />}
          text="채팅방링크"
          style={{ opacity: 0.6 }}
        />
      </div>
      <SelectHeadCountPopup
        isTurnedOn={isHeadCountPopupTurnedOn}
        turnOff={() => setIsHeadCountPopupTurnedOn(false)}
        headCnts={headCnts}
        setHeadCnts={setHeadCnts}
      />
      <ClockPopup
        isTurnedOn={isClockPopupTurnedOn}
        turnOff={() => setIsClockPopupTurnedOn(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
