"use client";

import dynamic from "next/dynamic";
import Plus from "../images/jamsession/plus";
import { Dispatch, SetStateAction, useState } from "react";

const CreateJam = dynamic(
  () => import("@/app/(pages)/(only-user)/jamsession/popup/create-jam"),
  { ssr: false }
);

export default function JamNow({
  selectedDate,
  setSelectedDate,
  refetch,
  setResetSlideCalendarDots,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
  refetch;
  setResetSlideCalendarDots: Dispatch<SetStateAction<boolean>>;
}) {
  const [isTurnedOn, setIsTurnedOn] = useState(false);
  const turnOff = () => {
    setIsTurnedOn(!isTurnedOn);
  };

  return (
    <div>
      <span
        className="flex jusify-center items-center w-fit h-11 gap-1 pl-2.5 pr-4"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #A3FF0C",
          borderRadius: "6.25rem",

          position: "absolute",
          bottom: "9.6%",
          right: "5.33%",

          cursor: "pointer",
        }}
        onClick={() => setIsTurnedOn(true)}
      >
        <Plus />
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "0.875rem",
            color: "#A3FF0C",
            textAlign: "center",
            lineHeight: "normal",
            letterSpacing: "-0.336px",
            transform: "translateY(0.075rem)",
          }}
        >
          JAM NOW!
        </p>
      </span>
      <CreateJam
        isTurnedOn={isTurnedOn}
        turnOff={turnOff}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        refetch={refetch}
        setResetSlideCalendarDots={setResetSlideCalendarDots}
      />
    </div>
  );
}
