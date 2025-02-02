"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Calendar from "@/app/ui/images/jamsession/calendar";
import { PickersCalendarHeader } from "@mui/x-date-pickers/PickersCalendarHeader";
import {
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers/PickersDay/PickersDay";
import { Badge } from "@mui/material";

const MapDateToKor = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

export default function TestPage() {
  // PREVENT HYDRATION FAIL
  // STATES & MEMOS
  const today = useMemo(() => moment(), []);

  const [isClient, setIsClient] = useState(false);

  const [selectedDate, setSelectedDate] = useState<number>();
  //

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // 클라이언트에서만 렌더링
  }
  //

  const CustomCalendarHeader = (props) => {
    return (
      <div>
        <PickersCalendarHeader {...props} />
        {/* <div className="flex gap-2" style={{ marginBottom: "24px" }}>
          이곳은 필터가 들어갈것이다
        </div> */}
      </div>
    );
  };
  const CustomDay = (
    props: PickersDayProps<moment.Moment> & { highlightedDays?: number[] }
  ) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const filtered =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;

    return (
      <div className="relative basis-1/7 flex justify-center">
        {filtered && (
          <div
            style={{
              width: "4px",
              height: "4px",

              borderRadius: "50%",

              backgroundColor:
                props.day.format("YYYY-MM-DD") === today.format("YYYY-MM-DD") &&
                selectedDate !== today.date()
                  ? "var(--border)"
                  : "var(--highlight)",

              position: "absolute",
              top: "50%",
              left: "45%",
              zIndex: 10,
            }}
          />
        )}
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          onClick={() => setSelectedDate(day.date())}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {isClient ? (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ko">
          <DateCalendar
            slots={{
              calendarHeader: CustomCalendarHeader,
              switchViewIcon: Calendar,
              day: CustomDay,
            }}
            slotProps={{
              switchViewButton: {
                color: "inherit",
                style: {
                  width: "28px",
                  height: "28px",

                  padding: "6px",

                  borderRadius: "4px",
                  border: "1px solid #444447",
                  backgroundColor: "#323234",
                },
              },
              calendarHeader: {
                format: `M월 D일 ${MapDateToKor[moment().day()]}요일`,
              },
              leftArrowIcon: {
                htmlColor: "#FFFFFF",
              },
              rightArrowIcon: {
                htmlColor: "#FFFFFF",
              },
              day: {
                highlightedDays: [2, 5],
              } as any,
            }}
            sx={{
              maxHeight: "100%",
              height: "100%",

              // HEADER
              "& .MuiPickersCalendarHeader-root": {
                marginTop: "0px",
                marginBottom: "24px",
                padding: "0px",
              },
              "& .MuiPickersCalendarHeader-labelContainer": {
                gap: "8px",
              },
              "& .MuiPickersCalendarHeader-label": {
                fontFamily: "SUIT-TITLE",
                fontSize: "1.125rem",
                order: 2,
              },
              "& .MuiIconButton-edgeStart": {
                padding: "0px 0px 0px 12px",
              },
              "& .MuiIconButton-edgeEnd": {
                padding: "0px 12px 0px 0px",
              },

              // BODY
              // // BODY - HEADER
              "& .MuiTypography-root": {
                flexBasis: "calc(14.28%)",

                height: "22px",
                padding: "4px 8px",
                // margin: "0px",

                color: "#FFF",
                textAlign: "center",
                fontFamily: "Pretendard-400",
                fontStyle: "normal",
                fontSize: "0.75rem",
                lineHeight: "normal",
              },
              "& .MuiTypography-root:nth-of-type(7n+1)": { color: "#FF3773" }, // 일요일 (첫째 날이 일요일 기준)
              "& .MuiTypography-root:nth-of-type(7n)": { color: "#0C7CFF" }, // 토요일

              "& .MuiDayCalendar-header": {
                padding: "4px 0px",
              },
              // //

              // // BODY - BODY
              "& .MuiPickersDay-root": {
                height: "64px",

                padding: "8px",
                color: "#FFF",
                alignItems: "start",
              }, // 날짜 글자색 변경

              "& .MuiPickersDay-root:hover": {
                backgroundColor: "transparent",
              },

              "& .MuiPickersDay-root.Mui-selected": {
                border: "1px solid var(--highlight)",
                color: "white",
                backgroundColor: "transparent",
                borderRadius: "4px",
              },
              // "& .MuiPickersDay-root.Mui-selected:hover": {
              //   backgroundColor: "transparent",
              // },

              "& .MuiPickersDay-today": {
                color: "var(--border)",
                backgroundColor: "var(--highlight)",
                borderRadius: "4px",
              },
              // "& .MuiTouchRipple-root": {
              //   backgroundColor: "transparent",
              // },
              // "& .Mui-selected": {
              //   backgroundColor: "transparent",
              // },
              "& [class$='-slideTransition']": {
                overflow: "visible",
              },
              "& [class*='ripple']": {
                backgroundColor: "transparent",
              },
              "& [class*='Ripple']": {
                backgroundColor: "transparent",
              },
              // //
              //
            }}
          />
        </LocalizationProvider>
      ) : null}
    </div>
  );
}
