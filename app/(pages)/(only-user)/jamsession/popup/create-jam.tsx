"use client";

import { RightArrow } from "@/app/ui/images/arrows";
import X from "@/app/ui/images/common/x";
import {
  CreateJam_ImageRemoveIcon,
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
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import ClockPopup from "./clock";
import moment from "moment";
import { FormData_Post, FormSchema_Post } from "@/app/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertFormData } from "@/app/lib/functions/convert";
import { createJam } from "../functions/fetch";
import SearchSongPopup from "./search-song";
import { DTO_Song, ImageFile } from "@/app/lib/interfaces/dto.interface";
import Image from "next/image";
import RegisterOpenchatPopup from "./register-openchat";

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
      onClick={onClick}>
      <p
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#DCDCDD",
        }}>
        {left}
      </p>
      <span className="flex flex-row items-center gap-2 cursor-pointer">
        {err}
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#DCDCDD",
            opacity: 1,
          }}>
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
  refetch,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
  refetch;
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
  const [isSearchSongPopupTurnedOn, setIsSearchSongPopupTurnedOn] =
    useState(false);
  const [isRegisterOpenchatPopupTurnedOn, setIsRegisterOpenchatPopupTurnedOn] =
    useState(false);

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);

  const [headCnts, setHeadCnts] = useState<number[]>(new Array(6).fill(0));
  const [anyone, setAnyone] = useState<boolean>(false);

  const [songs, setSongs] = useState<DTO_Song[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [openchat, setOpenchat] = useState<string>("");
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
      max_head_cnt: headCnts.reduce((acc, cur) => acc + cur, 0),
      date: selectedDate?.format("YYYY-MM-DD"),
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
      "max_head_cnt",
      headCnts.reduce((acc, cur) => acc + cur, 0)
    );
  }, [headCnts]);
  useEffect(() => {
    if (selectedDate) setValue("date", selectedDate.format("YYYY-MM-DD"));
  }, [selectedDate]);

  useEffect(() => {
    console.log("songs", songs);
    console.log("images", images);
  }, [songs, images]);
  //

  // HANDLERS
  const onSubmit = async (data: FormData_Post) => {
    await createJam(convertFormData(data)).then((res) => {
      if (res) {
        refetch();
        turnOff();
      }
      // TODO: 실패 팝업
      else {
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList) {
      const newImages = Array.from(fileList)
        .slice(0, 5)
        .map((row) => ({
          id: Date.now(), // 고유한 ID 생성
          name: row?.name,
          url: URL.createObjectURL(row), // 미리보기 URL 생성
        }));

      if (newImages.length + images.length <= 5)
        setImages([...images, ...newImages]);
      else setImages(newImages);
    }
  };

  const handleFileRemove = (idx: number) => {
    console.log("remove clicked");
    setImages(images.filter((_, innerIdx) => innerIdx !== idx));
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
      }}>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        <div
          className="flex flex-row justify-between py-3 px-5"
          style={{
            borderBottom: "1px solid #333335",
          }}>
          <X onClick={turnOff} />
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1rem",
              color: "#FFF",
            }}>
            JAM NOW!
          </p>
          <button
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1rem",
              color: "#A3FF0C",
              cursor: "pointer",
            }}
            type="submit">
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
                  }}>
                  {"카테고리를 선택해주세요."}
                </p>
              )
            }
            right={[GenreEnum[genre], LevelEnum[level]]
              .filter((elem) => elem)
              .join(" ")}
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
                    isCreatePopup={true}
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
                  }}>
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
            {images.length > 0 && (
              <div
                className="flex flex-col gap-3"
                style={{
                  color: "#9F9FA2",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.75rem",
                  lineHeight: "140%",
                  letterSpacing: "-0.288px",
                }}>
                <div className="flex flex-wrap gap-4">
                  {images.map((image, idx) => (
                    <div key={idx} className="relative">
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          position: "relative",
                        }}>
                        <Image
                          src={image.url}
                          alt=""
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CreateJam_ImageRemoveIcon
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                        }}
                        onClick={() => handleFileRemove(idx)}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p>*첫번째 사진은 게시글의 대표사진으로 지정됩니다.</p>
                  <p>사진은 최대 5개까지 첨부 가능합니다.</p>
                </div>
              </div>
            )}
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
          }}>
          <ImageWithTxt
            image={<MusicNote />}
            text="합주곡"
            style={{ opacity: 0.6, cursor: "pointer" }}
            onClick={() => setIsSearchSongPopupTurnedOn(true)}
          />
          <div className="relative flex items-center">
            <ImageWithTxt
              image={<Gallery />}
              text="사진"
              style={{ opacity: 0.6 }}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full h-full absolute opacity-0 z-20 top-0 left-0"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <ImageWithTxt
            image={<Location />}
            text="장소"
            style={{ opacity: 0.6, cursor: "pointer" }}
          />
          <ImageWithTxt
            image={<OpenChat />}
            text="채팅방링크"
            style={{ opacity: 0.6, cursor: "pointer" }}
            onClick={() => setIsRegisterOpenchatPopupTurnedOn(true)}
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
        <SearchSongPopup
          isTurnedOn={isSearchSongPopupTurnedOn}
          turnOff={() => setIsSearchSongPopupTurnedOn(false)}
          addNewSong={(newSong: DTO_Song) => {
            setSongs([...songs, newSong]);
          }}
        />
        <RegisterOpenchatPopup
          isTurnedOn={isRegisterOpenchatPopupTurnedOn}
          turnOff={() => setIsRegisterOpenchatPopupTurnedOn(false)}
          setOpenchat={setOpenchat}
        />
      </form>
    </div>
  );
}
