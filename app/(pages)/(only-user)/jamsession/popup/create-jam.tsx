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
  ReactNode,
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
import { FormData_Post, FormSchema_Post } from "@/app/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJam } from "@/app/api/functions/create";
import { convertFormData } from "@/app/lib/functions/convert";

const FlexRow = ({
  left,
  err,
  right,
  onClick,
}: {
  left: string;
  err?: ReactNode;
  right: string;
  onClick?: any;
}) => {
  return (
    <div
      className="flex flex-row justify-between items-center px-5 py-2"
      style={{
        height: "6.9%",
        borderBottom: "1px solid #333335",
        cursor: "pointer",
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
      <span className="flex flex-row items-center gap-2 cursor-pointer">
        {err}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#DCDCDD",
            opacity: right === "선택" ? 0.6 : 1,
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

  // STATES
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [isHeadCountPopupTurnedOn, setIsHeadCountPopupTurnedOn] =
    useState(false);
  const [isClockPopupTurnedOn, setIsClockPopupTurnedOn] = useState(false);

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);

  const [headCnts, setHeadCnts] = useState<number[]>(new Array(6).fill(0));
  const [anyone, setAnyone] = useState<boolean>(false);
  //

  // FORM
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    getValues,
    setError,
  } = useForm<FormData_Post>({
    defaultValues: {
      title: "",
      body: "",
      genre: [genre],
      pos: [position],
      level: [level],
      headCnt: headCnts.reduce((acc, cur) => acc + cur, 0),
      date: selectedDate.format("YYYY-MM-DD"),
    },
    resolver: zodResolver(FormSchema_Post),
  });
  //

  // HOOKS
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
    setValue("pos", [position]);
  }, [position]);
  useEffect(() => {
    setValue("genre", [genre]);
  }, [genre]);
  useEffect(() => {
    setValue("level", [level]);
  }, [level]);
  useEffect(() => {
    setValue(
      "headCnt",
      headCnts.reduce((acc, cur) => acc + cur, 0)
    );
  }, [headCnts]);
  useEffect(() => {
    setValue("date", selectedDate.format("YYYY-MM-DD"));
  }, [selectedDate]);
  //

  // HANDLERS
  const onSubmit = async (data: FormData_Post) => {
    await createJam(convertFormData(data)).then((res) => {
      if (res) turnOff();
    });
  };
  //

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <button
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1rem",
              color: "#A3FF0C",
            }}
            type="submit"
          >
            완료
          </button>
        </div>
        <div className="grow flex flex-col">
          <FlexRow
            left="카테고리"
            err={
              (formState.errors.genre ||
                formState.errors.pos ||
                formState.errors.level) && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                  }}
                >
                  {"카테고리를 선택해주세요."}
                </p>
              )
            }
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
            right={
              anyone
                ? "상관없음"
                : headCnts.reduce((acc, cur) => acc + cur, 0).toString()
            }
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
          <div className="flex flex-col gap-4 px-5 pt-6 overflow-without-scroll">
            <style jsx>{`
              input::placeholder,
              textarea::placeholder {
                color: #fff;
                opacity: 0.5;
              }
            `}</style>
            <div className="w-full">
              <input
                type="text"
                placeholder="제목을 입력하세요."
                style={{
                  width: "100%",

                  fontFamily: "SUIT-BODY",
                  fontSize: "1rem",
                  fontStyle: "normal",

                  lineHeight: "normal",
                  letterSpacing: "-0.384px",
                }}
                maxLength={20}
                {...register("title")}
              />
              {formState.errors.title && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                  }}
                >
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <textarea
              placeholder="즐거운 잼세션을 위한 모집글을 적어주세요."
              style={{
                height: "30.64vh",

                color: "#FFF",
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                fontStyle: "normal",

                lineHeight: "normal",
                letterSpacing: "-0.336px",
              }}
              {...register("body")}
            />
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
          anyone={anyone}
          setAnyone={setAnyone}
        />
        <ClockPopup
          isTurnedOn={isClockPopupTurnedOn}
          turnOff={() => setIsClockPopupTurnedOn(false)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </form>
    </div>
  );
}
