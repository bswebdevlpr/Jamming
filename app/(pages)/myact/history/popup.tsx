import { RightArrow } from "@/app/ui/images/arrows";
import X from "@/app/ui/images/common/x";
import OopsIcon from "@/app/ui/images/myact/oopts";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { ReactNode, useEffect, useRef } from "react";

export default function Popup({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);

  return (
    <div
      ref={ref}
      className="hidden absolute w-full h-full flex justify-center items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        top: 0,
        left: 0,
      }}
    >
      <div
        className="grow flex flex-col px-5 pt-7 pb-5 relative mx-8"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #444447",
          borderRadius: "12px",
        }}
      >
        <X
          className="absolute"
          onClick={turnOff}
          style={{
            top: "20px",
            right: "20px",
          }}
        />
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-5 items-center">
            <p
              className="w-full text-center"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "1rem",
                color: "#FFF",
              }}
            >
              OOPS!!
            </p>
            <OopsIcon />
            <p
              className="w-full text-center"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#E5E5E9",

                lineHeight: "140%",
              }}
            >
              이 멤버가 참여하지 않았나요?
              <br /> 참여 여부를 체크해주세요.
            </p>
          </div>
          <div className="w-full flex flex-row justify-center gap-3">
            <ButtonTemplate
              text="참여 안했어요ㅠㅠ"
              className="basis-1/2"
              style={{
                fontSize: "0.875rem",
                color: "#FFF",
                border: "1px solid #444447",
              }}
            />
            <ButtonTemplate
              text="참여 했어요!"
              className="basis-1/2"
              style={{
                fontSize: "0.875rem",
                color: "#A3FF0C",

                backgroundColor: "#242426",
                border: "1px solid #A3FF0C",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
