import { RightArrow } from "@/app/ui/images/arrows";
import X from "@/app/ui/images/common/x";
import { ReactNode, useEffect, useRef } from "react";

const FlexRow = ({ tags }: { tags: ReactNode }) => {
  return (
    <div className="flex flex-row items-center py-4 gap-5">
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "100px",
          background:
            "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
        }}
      />
      <div className="grow flex flex-col gap-2">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#F2F2F4",
          }}
        >
          닉네임
        </p>
        <div className="flex flex-row gap-1.5">
          <p
            className="text-center px-2 py-1"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#F2F2F4",

              borderRadius: "100px",
              border: "0.8px solid #767678",
            }}
          >
            포지션
          </p>
          {tags}
        </div>
      </div>
      <div
        className="w-6 h-6 flex justify-center items-center"
        style={{
          borderRadius: "100px",
          backgroundColor: "#323234",
        }}
      >
        <RightArrow />
      </div>
    </div>
  );
};

export default function Popup({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("turnoff triggered", isTurnedOn);

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
      }}
    >
      <div
        className="grow flex flex-col px-5 pt-4 pb-5 mx-8"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #444447",
          borderRadius: "12px",
        }}
      >
        <div className="flex flex-row justify-between mb-5">
          <p
            style={{
              fontFamily: "SBAggroM",
              fontSize: "1rem",
              color: "#FFF",
            }}
          >
            참여중인 멤버
          </p>
          <X onClick={turnOff} />
        </div>
        <FlexRow
          tags={
            <p
              className="text-center px-2 py-1"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#A3FF0C",

                borderRadius: "100px",
                border: "0.8px solid #A3FF0C",
              }}
            >
              114BPM
            </p>
          }
        />
        <FlexRow
          tags={
            <p
              className="text-center px-2 py-1"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#FF3773",

                borderRadius: "100px",
                border: "0.8px solid #FF3773",
              }}
            >
              240BPM
            </p>
          }
        />
      </div>
    </div>
  );
}
