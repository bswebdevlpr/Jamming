import { MapDateToKor } from "@/app/lib/maps/moment";
import DigitalClockComponent from "@/app/ui/clocks/digital-clock";
import { LeftArrow } from "@/app/ui/images/arrows";
import { ImageWithTxt } from "@/app/ui/templates/images";
import PopupTemplate from "@/app/ui/templates/popup";
import { Dispatch, SetStateAction } from "react";

export default function ClockPopup({
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
  return (
    <PopupTemplate isTurnedOn={isTurnedOn}>
      <div className="w-full flex flex-col items-center px-5">
        <ImageWithTxt
          image={<LeftArrow />}
          text="시간 선택"
          className="py-3 gap-3 mb-4"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
          }}
          onClick={turnOff}
        />
        <p
          style={{
            color: "#FFF",
            fontFamily: "Pretendard-500",
            fontSize: "1rem",
            fontStyle: "normal",
            lineHeight: "152%",
            textAlign: "center",
          }}
        >
          {selectedDate
            ? selectedDate.format("YYYY년 M월 DD일 ") +
              `${MapDateToKor[selectedDate.day()]}요일`
            : "0000년 0월 0일 요일"}
        </p>
        <DigitalClockComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </PopupTemplate>
  );
}
