import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface DateDto {
  date: string;
  day: string;
  month: string;
  year: string;
}

const MapDateToKor = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

export default function CommuteRecordDateSlider() {
  // CONSTANTS

  const enumerateDaysBetweenDates = (startDate, endDate) => {
    const dates: DateDto[] = [];

    for (
      let now = startDate.clone();
      now.isSameOrBefore(endDate);
      now.add(1, "days")
    ) {
      const obj = {
        date: MapDateToKor[now.format("d")],
        day: now.format("DD"),
        month: now.format("MM"),
        year: now.format("YYYY"),
      };
      dates.push(obj);
    }
    return dates;
  };
  //

  // REF
  //

  // HOOKS
  //

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

  const { today, twoWeeksLater } = useMemo(() => {
    const today = moment();
    const twoWeeksLater = moment().add(2, "weeks").endOf("week");

    return {
      today,
      twoWeeksLater,
    };
  }, []);

  const [dates, setDates] = useState<DateDto[]>(null);
  const [selectedDay, setSelectedDate] = useState<string>(today.format("DD"));
  //

  // USE-EFFECTS
  useEffect(() => {
    setDates(enumerateDaysBetweenDates(today, twoWeeksLater));
  }, [today, twoWeeksLater]);
  //

  const sliders = () => {
    return dates?.map((date, idx) => {
      const highlight = date.day === selectedDay;
      return (
        <div key={idx} className="flex flex-col" onClick={() => {}}>
          <div
            className="flex flex-col items-center py-1"
            style={{
              width: "32px",
              height: "56px",

              borderRadius: "4px",
              border: highlight ? "1px solid var(--highlight)" : undefined,
              background: highlight ? "rgba(163, 255, 12, 0.12)" : undefined,

              fontFamily: "SUIT-TITLE",

              cursor: "pointer",
            }}>
            <span
              style={{
                color: highlight ? "var(--highlight)" : "#FFF",
                fontSize: "0.75rem",
                lineHeight: "normal",
                letterSpacing: "-0.3px",

                marginBottom: "2px",
              }}>
              {date.date}
            </span>
            <span
              style={{
                color: highlight ? "var(--highlight)" : "#FFF",
                fontSize: "0.75rem",
                lineHeight: "normal",
                letterSpacing: "-0.35px",

                marginBottom: "6px",
              }}>
              {date.day}
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
      <Slider {...settings}>{sliders()}</Slider>
    </div>
  );
}
