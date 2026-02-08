"use client";

import Bell from "@/app/ui/images/jamsession/bell";
// import CalendarImage from "@/app/ui/images/jamsession/calendar";
// import { Dispatch, SetStateAction, useContext } from "react";
// import CalendarComponent from "../../calendar/calendar";
import { MapDateToKor } from "@/app/lib/maps/moment";
import { Filter_JamSessionFeed } from "../../feeds/jam-feed";
import { useRouter } from "next/navigation";

export default function TopNavBar({
  filter,
}: // setFilter,
// setSelectedDate,
{
  filter: Filter_JamSessionFeed;
  // setFilter: Dispatch<SetStateAction<Filter_JamSessionFeed>>;
  // setSelectedDate: (input: moment.Moment) => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-row justify-between px-5 py-3">
      <p
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#FFF",
        }}>
        {`${
          filter.selectedDate.month() + 1
        }월 ${filter.selectedDate.date()}일 ${
          MapDateToKor[filter.selectedDate.day()]
        }요일`}
      </p>
      <div className="flex flex-row gap-5">
        <Bell onClick={() => router.push("/notification")} />
        {/* <CalendarImage
          onClick={() =>
            bottomSheet.set({
              header: false,
              location: "high",
              children: (
                <CalendarComponent
                  filter={filter}
                  setFilter={setFilter}
                  setSelectedDate={setSelectedDate}
                />
              ),
            })
          }
        /> */}
      </div>
    </div>
  );
}
