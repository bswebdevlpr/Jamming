"use client";

import { useBottomSheetStore, useCalendarStore } from "@/app/stores";
import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToLocation,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import { ZodSchema_Post, ZodType_Post, ZodType_Song } from "@/app/lib/zod";
import { FormFieldRow } from "@/app/ui/rows/form-field-row";
import X from "@/app/ui/images/common/x";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import BottomSheetContent from "../../../bottom-sheet/content";
import { updateJam } from "../../../functions/fetch";
import ClockPopup from "../../../popup/clock";
import LocationPopup from "@/app/ui/popup/location";
import RegisterOpenchatPopup from "../../../popup/register-openchat";
import SearchLocationPopup from "../../../popup/search-location";
import SearchSongPopup from "../../../popup/search-song";
import SelectHeadCountPopup from "../../../popup/select-headcount";
import { JamImagePreview, JamFormToolbar } from "@/app/ui/jam-form";

export default function UpdateJam({
  isTurnedOn,
  turnOff,
  jam,
  jamId,
  selectedDate,
  refetch,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  jam: Entity_JamSession;
  jamId: number;
  selectedDate: moment.Moment | null;
  refetch: () => Promise<void>;
}) {
  // ZUSTAND STORES
  const bottomSheet = useBottomSheetStore();
  const setResetSlideCalendarDots = useCalendarStore(
    (state) => state.setResetSlideCalendarDots
  );
  //

  const ref = useRef<HTMLDivElement>(null);

  const pathname = usePathname(),
    searchParams = useSearchParams();

  // STATES
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [isLocationPopupClicked, setIsLocationPopupClicked] = useState(false);
  const [isHeadCountPopupTurnedOn, setIsHeadCountPopupTurnedOn] =
    useState(false);
  const [isClockPopupTurnedOn, setIsClockPopupTurnedOn] = useState(false);
  const [isSearchSongPopupTurnedOn, setIsSearchSongPopupTurnedOn] =
    useState(false);
  const [isSearchLocationPopupTurnedOn, setIsSearchLocationPopupTurnedOn] =
    useState(false);
  const [isRegisterOpenchatPopupTurnedOn, setIsRegisterOpenchatPopupTurnedOn] =
    useState(false);

  const [headTotal, setHeadTotal] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedDateState, setSelectedDateState] = useState<moment.Moment>(
    selectedDate ?? moment()
  );
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
    clearErrors,
    reset,
  } = useForm<ZodType_Post>({
    defaultValues: {
      title: "",
      body: "",
      location: [],
      genre: [],
      level: [],
      headcnt_by_pos: Object.keys(MapDataToPosition).map((key) => ({
        pos: key,
        headcnt: 0,
      })),
      datetime: (selectedDate ?? moment()).toISOString(),
      songs: [],
      images: [],
      location_detail: null,
      openchat: "",
    },
    resolver: zodResolver(ZodSchema_Post),
  });

  const location = watch("location"),
    genre = watch("genre"),
    level = watch("level"),
    headcnt_by_pos = watch("headcnt_by_pos"),
    location_detail = watch("location_detail"),
    songs = watch("songs"),
    images = watch("images"),
    openchat = watch("openchat");
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
    if (selectedDateState) {
      setValue("datetime", selectedDateState.toISOString(), {
        shouldValidate: false,
      });
      clearErrors();
    }
  }, [selectedDateState, clearErrors, setValue]);

  useEffect(() => {
    setHeadTotal(headcnt_by_pos.reduce((acc, cur) => acc + cur.headcnt, 0));
  }, [headcnt_by_pos]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedDateState(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    return () => {
      // 메모리 누수 방지: 생성된 Object URL 해제
      images.forEach((img) => {
        if (img.thumbnail) URL.revokeObjectURL(img.thumbnail);
      });
      reset();
    };
  }, [pathname, searchParams, reset, images]);

  useEffect(() => {
    if (!jam) return;

    const defaultHeadcnt = Object.keys(MapDataToPosition).map((key) => ({
      pos: key,
      headcnt: 0,
    }));

    reset({
      title: jam.title ?? "",
      body: jam.body ?? "",
      location: jam.location ? [MapDataToLocation[jam.location]] : [],
      genre: jam.genre ? [MapDataToGenre[jam.genre]] : [],
      level: jam.level ? [MapDataToLevel[jam.level]] : [],
      headcnt_by_pos: jam.headcnt_by_pos && jam.headcnt_by_pos.length > 0
        ? jam.headcnt_by_pos
        : defaultHeadcnt,
      datetime: (jam.datetime ? moment(jam.datetime) : selectedDateState).toISOString(),
      songs: jam.songs ?? [],
      images: [],
      location_detail: jam.location_detail ?? null,
      openchat: jam.openchat ?? "",
    });

    setExistingImages(jam.images ?? []);
    if (jam.datetime) setSelectedDateState(moment(jam.datetime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jam, reset]);
  //

  // HANDLERS
  const onSubmit = async (data: ZodType_Post) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await updateJam(jamId, data, {
      preservedImages: existingImages,
    })
      .then((res) => {
        setValue("images", [], { shouldValidate: false });

        if (res) {
          setExistingImages(res.images ?? []);
          refetch();
          setResetSlideCalendarDots?.(true);
          turnOff();
        } else {
          alert("잼세션 수정에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch(() => {
        alert("잼세션 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList) {
      const validFiles = Array.from(fileList)
        .filter((file) => {
          if (file.size > MAX_FILE_SIZE) {
            alert(`파일 ${file.name}이(가) 10MB를 초과합니다.`);
            return false;
          }
          if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            alert(`파일 ${file.name}은(는) 지원하지 않는 형식입니다.`);
            return false;
          }
          return true;
        })
        .slice(0, 5);

      const newImages = validFiles.map((row) => ({
        file: row,
        thumbnail: URL.createObjectURL(row),
      }));

      if (newImages.length + images.length <= 5)
        setValue("images", [...images, ...newImages], {
          shouldValidate: false,
        });
      else setValue("images", newImages, { shouldValidate: false });
    }
  };

  const handleFileRemove = (idx: number) => {
    setValue(
      "images",
      images.filter((_, innerIdx) => innerIdx !== idx),
      { shouldValidate: false }
    );
  };

  const handleExistingFileRemove = (idx: number) => {
    setExistingImages((prev) =>
      prev.filter((_, innerIdx) => innerIdx !== idx)
    );
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
      <form
        onSubmit={handleSubmit(onSubmit, (e) => {
          if (process.env.NODE_ENV === "development") {
            console.log(e);
            console.log(getValues());
          }
        })}
        className="h-full flex flex-col"
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
          <button
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "1rem",
              color: "#A3FF0C",
              cursor: "pointer",
            }}
            type="submit"
          >
            완료
          </button>
        </div>
        <div className="grow flex flex-col">
          <FormFieldRow
            left="지역"
            err={
              formState.errors.location && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                  }}
                >
                  {"지역을 선택해주세요."}
                </p>
              )
            }
            right={location[0]}
            onClick={() => setIsLocationPopupClicked(true)}
          />
          <FormFieldRow
            left="카테고리"
            err={
              (formState.errors.genre || formState.errors.level) && (
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
            right={[genre[0], level[0]].filter((elem) => elem).join(" ")}
            onClick={() =>
              bottomSheet.set({
                location: 88.5,
                children: (
                  <BottomSheetContent
                    genre={MapDataToGenre[genre[0]]}
                    level={MapDataToLevel[level[0]]}
                    setGenre={(val) => {
                      setValue("genre", [val], { shouldValidate: false });
                      clearErrors();
                    }}
                    setLevel={(val) => {
                      setValue("level", [val], { shouldValidate: false });
                      clearErrors();
                    }}
                    isCreatePopup={true}
                  />
                ),
              })
            }
          />
          <FormFieldRow
            left="참여 인원"
            right={(() =>
              headTotal > 0 ? headTotal.toString() : "상관없음")()}
            onClick={() => setIsHeadCountPopupTurnedOn(true)}
          />
          <FormFieldRow
            left="날짜"
            right={
              selectedDateState
                ? selectedDateState.format("YYYY.MM.DD HH:mm")
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
                fontSize: "1rem",
                fontFamily: "SUIT-BODY",
                fontStyle: "normal",

                lineHeight: "normal",
                letterSpacing: "-0.336px",

                marginBottom: "2px",

                resize: "none",
              }}
              {...register("body")}
            />
            <JamImagePreview
              images={images}
              existingImages={existingImages}
              onRemove={handleFileRemove}
              onExistingRemove={handleExistingFileRemove}
            />
          </div>
        </div>
        <JamFormToolbar
          onSongClick={() => setIsSearchSongPopupTurnedOn(true)}
          onFileChange={handleFileChange}
          onLocationClick={() => setIsSearchLocationPopupTurnedOn(true)}
          onOpenchatClick={() => setIsRegisterOpenchatPopupTurnedOn(true)}
        />
        <LocationPopup
          isTurnedOn={isLocationPopupClicked}
          turnOff={() => setIsLocationPopupClicked(false)}
          setLocation={(val) =>
            setValue("location", [val], { shouldValidate: false })
          }
        />
        <SelectHeadCountPopup
          isTurnedOn={isHeadCountPopupTurnedOn}
          turnOff={() => setIsHeadCountPopupTurnedOn(false)}
          headCnts={headcnt_by_pos}
          setHeadCnts={(val) =>
            setValue("headcnt_by_pos", val, { shouldValidate: false })
          }
        />
        <ClockPopup
          isTurnedOn={isClockPopupTurnedOn}
          turnOff={() => setIsClockPopupTurnedOn(false)}
          selectedDate={selectedDateState}
          setSelectedDate={setSelectedDateState}
        />
        <SearchSongPopup
          isTurnedOn={isSearchSongPopupTurnedOn}
          turnOff={() => setIsSearchSongPopupTurnedOn(false)}
          addNewSong={(newSong: ZodType_Song) =>
            setValue("songs", [...songs, newSong], { shouldValidate: false })
          }
        />
        <SearchLocationPopup
          isTurnedOn={isSearchLocationPopupTurnedOn}
          turnOff={() => setIsSearchLocationPopupTurnedOn(false)}
          setLocation={(val) =>
            setValue("location_detail", val, { shouldValidate: false })
          }
        />
        <RegisterOpenchatPopup
          isTurnedOn={isRegisterOpenchatPopupTurnedOn}
          turnOff={() => setIsRegisterOpenchatPopupTurnedOn(false)}
          setOpenchat={(val) =>
            setValue("openchat", val, { shouldValidate: false })
          }
        />
      </form>
    </div>
  );
}
