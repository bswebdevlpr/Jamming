import { Entity_JamSession } from "@/app/lib/interfaces/entity.interface";
import X from "@/app/ui/images/common/x";
import OopsIcon from "@/app/ui/images/myact/oopts";
import ButtonTemplate from "@/app/ui/templates/buttons";
import moment from "moment";
import { useEffect, useMemo, useRef } from "react";
import { setNoShow } from "../functions/fetch";

export default function NoshowPopup({
  jam,
  isTurnedOn,
  entryId,
  turnOff,
}: {
  jam: Entity_JamSession;
  isTurnedOn: boolean;
  entryId: number;
  turnOff: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isActive = useMemo(() => moment().isAfter(moment(jam.date)), [jam]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = isTurnedOn ? "flex" : "none";
    }
  }, [isTurnedOn]);

  return (
    <div
      ref={ref}
      className="hidden absolute z-10 w-full h-full flex justify-center items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        top: 0,
        left: 0,
      }}
      onClick={turnOff}
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
            {!isActive ? (
              <p
                style={{
                  color: "var(--highlight)",
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",

                  border: "1px solid var(--highlight)",
                  borderRadius: "4px",

                  padding: "8px 12px",
                }}
              >
                노쇼 체크는 합주가 끝난 후 가능해요
              </p>
            ) : (
              <>
                <ButtonTemplate
                  text="참여 안했어요ㅠㅠ"
                  className="basis-1/2"
                  style={{
                    fontSize: "0.875rem",
                    color: "#FFF",
                    border: "1px solid #444447",
                  }}
                  onClick={() => {
                    setNoShow(entryId, true);
                    turnOff();
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
                  onClick={() => turnOff()}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
