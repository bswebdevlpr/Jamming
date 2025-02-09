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
}: {
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
}) {
  let sliderRef = useRef(null);

  // STATES & MEMOS
  const settings = useMemo(() => {
    return {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      // vertical: false,
    };
  }, []);

  const { today, endOfPeriod } = useMemo(() => {
    const today = moment();
    const endOfPeriod = today.clone().add(2, "week").subtract(1, "day");

    return {
      today,
      endOfPeriod,
    };
  }, []);

  const [dates, setDates] = useState<moment.Moment[]>(null);
  //

  // USE-EFFECTS
  useEffect(() => {
    const dates: moment.Moment[] = [];

    for (
      let now = today.clone();
      now.isSameOrBefore(endOfPeriod);
      now.add(1, "days")
    ) {
      dates.push(now.clone());
    }

    setDates(dates);
  }, [today, endOfPeriod]);

  useEffect(() => {
    if (dates && dates.length > 0) {
      const idx = dates.reduce((acc, cur, idx) => {
        return cur.format("YYYYMMDD") === selectedDate.format("YYYYMMDD")
          ? idx
          : acc;
      }, 0);

      // @ts-expect-error: refer to react-slick api
      sliderRef.slickGoTo(idx);
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
              opacity: !highlight && (idx + 1) % 7 === 0 ? 0.5 : 1,

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
            <span
              className="w-1 h-1 shrink-0"
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "var(--highlight)",
                borderRadius: "50%",
              }}
            />
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
