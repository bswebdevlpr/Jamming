"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import moment, { locales } from "moment";
import CalendarImage from "@/app/ui/images/jamsession/calendar";
import { PickersCalendarHeader } from "@mui/x-date-pickers/PickersCalendarHeader";
import {
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers/PickersDay/PickersDay";
import SelectButton from "../buttons/select";
import { CalendarCategoryList } from "./category";
import { Filter_JamSessionFeed } from "@/app/(pages)/(only-user)/jamsession/page";

const MapDateToKor = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

export default function CalendarComponent({
  selectedDate,
  setSelectedDate,
  filter,
  setFilter,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: (input: moment.Moment) => void;
  filter: Filter_JamSessionFeed;
  setFilter: Dispatch<SetStateAction<Filter_JamSessionFeed>>;
}) {
  // PREVENT HYDRATION FAIL
  // STATES & MEMOS
  const today = useMemo(() => moment(), []);

  const [isClient, setIsClient] = useState(false);
  const [localSelectedDate, setLocalSelectedDate] =
    useState<moment.Moment>(selectedDate);
  //

  const handleSelectedDate = (input: moment.Moment) => {
    setSelectedDate(input);
    setLocalSelectedDate(input);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (localSelectedDate !== selectedDate) setLocalSelectedDate(selectedDate);
  }, [selectedDate]);

  if (!isClient) {
    return null; // 클라이언트에서만 렌더링
  }
  //

  const CustomCalendarHeader = (props) => {
    return (
      <div>
        <PickersCalendarHeader {...props} />
        <div style={{ marginBottom: "24px" }}>
          <CalendarCategoryList filter={filter} onClick={setFilter} />
        </div>
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
                localSelectedDate.format("YYYY-MM-DD") !==
                  today.format("YYYY-MM-DD")
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
          selected={
            localSelectedDate.format("YYYYMMDD") === day.format("YYYYMMDD")
          }
          onClick={() => handleSelectedDate(day)}
          style={{
            fontFamily: "Pretendard-400",
            fontSize: "1rem",
            lineHeight: "normal",
            fontStyle: "normal",
          }}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {isClient ? (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ko">
          <div
            className="flex flex-col justify-between items-center px-5 pt-5"
            style={{
              height: "93.5%",
            }}
          >
            <DateCalendar
              reduceAnimations
              minDate={today}
              maxDate={today.clone().add(3, "month")}
              slots={{
                calendarHeader: CustomCalendarHeader,
                switchViewIcon: CalendarImage,
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
                  format: `${today.month() + 1}월 ${today.date()}일 ${
                    MapDateToKor[today.day()]
                  }요일`,
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
                width: "100%",
                height: "fit-content",
                maxHeight: "80%",
                margin: "0px",

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
                  transition: "none",
                },
                "& .MuiIconButton-edgeEnd": {
                  padding: "0px 12px 0px 0px",
                },
                "& .MuiYearCalendar-root": {
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                },
                //

                // BODY
                // // BODY - HEADER
                "& .MuiTypography-root": {
                  flexBasis: "calc(14.28%)",

                  height: "22px",
                  padding: "4px 8px",

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
                  "&:focus": { backgroundColor: "transparent" },
                }, // 날짜 글자색 변경

                "& .MuiPickersDay-root.Mui-selected": {
                  border: "1px solid var(--highlight)",
                  color: "white",
                  backgroundColor: "transparent",
                  borderRadius: "4px",
                  "&:focus": { backgroundColor: "transparent" },
                },

                "& .MuiPickersDay-today": {
                  color: "var(--border)",
                  backgroundColor: "var(--highlight)",
                  borderRadius: "4px",
                },
                "& [class$='-slideTransition']": {
                  overflow: "visible",
                },
                // //
                //
              }}
            />
            <p
              className="text-center"
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "1.125rem",
                color: "#F2F2F4",
                lineHeight: "140%",
              }}
            >
              {localSelectedDate.format("M월 D일") +
                ` ${MapDateToKor[localSelectedDate.day()]}요일`}{" "}
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#767678",
                }}
              >
                선택됨
              </span>
            </p>
            <SelectButton
              style={{
                width: "100%",
              }}
              isActive={!!selectedDate}
            />
          </div>
        </LocalizationProvider>
      ) : null}
    </div>
  );
}
