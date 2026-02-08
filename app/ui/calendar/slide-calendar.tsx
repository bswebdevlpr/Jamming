"use client";

import moment from "moment";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDatesHavingJam } from "./functions/fetch";

const MapDateToKor = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

export default function SlideCalendarComponent({
  selectedDate,
  setSelectedDate,
  resetSlideCalendarDots,
  setResetSlideCalendarDots,
  fetchDates,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
  resetSlideCalendarDots?: boolean;
  setResetSlideCalendarDots?: Dispatch<SetStateAction<boolean>>;
  fetchDates?: () => Promise<string[]>;
}) {
  let sliderRef = useRef(null);

  // NAVIGATION
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  //

  // STATES & MEMOS
  const { startOfPeriod, endOfPeriod } = useMemo(() => {
    let startOfPeriod = moment();
    if (pathname === "/myact")
      startOfPeriod = startOfPeriod.subtract(2, "week");

    const endOfPeriod = moment().add(2, "week").subtract(1, "day");

    return {
      startOfPeriod,
      endOfPeriod,
    };
  }, []);

  const settings = useMemo(() => {
    const dateParam = moment(searchParams.get("date"));

    return {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      initialSlide: dateParam.isValid()
        ? dateParam.diff(startOfPeriod, "day") > 3
          ? Math.abs(startOfPeriod.diff(dateParam, "day")) - 2
          : 0
        : pathname === "/myact"
        ? Math.ceil(Math.abs(startOfPeriod.diff(endOfPeriod, "day")) / 2) - 3
        : 0,
    };
  }, [startOfPeriod, endOfPeriod, searchParams]);

  const [dates, setDates] = useState<moment.Moment[]>(null);
  const [datesHavingJam, setDatesHavingJam] = useState<string[]>([]);
  //

  // USE-EFFECTS
  useEffect(() => {
    const initiate = async () => {
      setDatesHavingJam(await (fetchDates ?? getDatesHavingJam)());
      if (setResetSlideCalendarDots) setResetSlideCalendarDots(false);
    };
    initiate();
  }, [resetSlideCalendarDots]);

  useEffect(() => {
    const dates: moment.Moment[] = [];

    for (
      let now = startOfPeriod.clone();
      now.isSameOrBefore(endOfPeriod);
      now.add(1, "days")
    ) {
      dates.push(now.clone());
    }

    setDates(dates);
  }, [startOfPeriod, endOfPeriod]);

  useEffect(() => {
    if (selectedDate.isAfter(endOfPeriod)) setSelectedDate(endOfPeriod.clone());
    else if (dates && dates.length > 0) {
      const idx = dates.reduce((acc, cur, idx) => {
        return cur.format("YYYYMMDD") === selectedDate.format("YYYYMMDD")
          ? idx
          : acc;
      }, 0);
      const params = new URLSearchParams();
      params.set("date", selectedDate.format("YYYYMMDD"));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      // @ts-expect-error: refer to react-slick api
      sliderRef.slickGoTo(idx > 3 ? idx - 3 : 0);
    }
  }, [selectedDate]);
  //

  const sliders = () => {
    return dates?.map((date, idx) => {
      const thisDay = date.day();

      const highlight =
        date.format("YYYYMMDD") === selectedDate.format("YYYYMMDD");

      return (
        <div key={idx} className="flex" onClick={() => setSelectedDate(date)}>
          <div
            className="flex flex-col items-center py-1 mx-auto"
            style={{
              width: "32px",
              height: "56px",

              borderRadius: "4px",
              border: highlight ? "1px solid var(--highlight)" : undefined,
              background: highlight ? "rgba(163, 255, 12, 0.12)" : undefined,

              fontFamily: "SUIT-TITLE",

              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: highlight ? "var(--highlight)" : "#FFF",
                fontSize: "0.75rem",
                lineHeight: "normal",
                letterSpacing: "-0.3px",

                marginBottom: "2px",
              }}
            >
              {MapDateToKor[thisDay]}
            </span>
            <span
              style={{
                color: highlight ? "var(--highlight)" : "#FFF",
                fontSize: "0.75rem",
                lineHeight: "normal",
                letterSpacing: "-0.35px",

                marginBottom: "6px",
              }}
            >
              {date.date()}
            </span>
            {datesHavingJam.includes(date.format("YYYYMMDD")) && (
              <span
                className="w-1 h-1 shrink-0"
                style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "var(--highlight)",
                  borderRadius: "50%",
                }}
              />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Slider
        {...settings}
        ref={(slider) => {
          sliderRef = slider;
        }}
      >
        {sliders()}
      </Slider>
    </div>
  );
}
