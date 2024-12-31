"use client";

import { SquaredCheckbox } from "@/app/ui/checkbox";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Profile from "@/app/ui/images/jamsession/profile";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { ReactNode, useEffect, useRef } from "react";

// {
//     title,
//     tags,
//     headCnt,
//     date,
//   }: {
//     title: string;
//     tags: ReactNode;
//     headCnt: number;
//     date: string;
//   }
const Tag = ({ text }: { text: string }) => {
  return (
    <div
      className="px-2 py-1"
      style={{
        backgroundColor: "#323234",
        borderRadius: "100px",
        textAlign: "center",

        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        color: "#F2F2F4",
      }}
    >
      {text}
    </div>
  );
};

const FlexRow = () => {
  return (
    <div
      className="flex flex-col py-3"
      style={{
        borderBottom: "1px solid #323234",
      }}
    >
      <div className="flex flex-row gap-2 items-center mb-2">
        <SquaredCheckbox />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          내가 만든 혹은 참여할 잼세션
        </p>
      </div>
      <div className="flex flex-row gap-1 pl-7 mb-5">
        <Tag text="시흥동" />
        <Tag text="락" />
        <Tag text="건반" />
        <Tag text="아마추어" />
        <Tag text="30대" />
      </div>
      <div className="w-full flex flex-row justify-between pl-7">
        <ImageWithTxt
          image={<Profile width={10.7} height={12} />}
          text={
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              <span style={{ color: "#A3FF0C" }}>5</span>/7
            </p>
          }
        />
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}
        >
          2024.12.24
        </p>
      </div>
    </div>
  );
};

export default function RejamPopup({
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
      className="absolute z-10 hidden w-full h-full flex flex-col justify-between left-0 top-0 px-4"
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      <div>
        <ImageWithTxt
          image={<LeftArrowWhite onClick={turnOff} />}
          text="초대하기"
          className="gap-2 py-3"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        />
        <div className="my-3">
          <p
            style={{
              fontFamily: "SBAggroB",
              fontSize: "1.5rem",
              color: "#A3FF0C",
            }}
          >
            REJAM!
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#C0C0C5",
            }}
          >
            함께한 멤버와 한번더 잼세션을 하고싶으신가요? <br />
            내가 참여한 잼세션에 멤버를 초대할 수 있어요.
          </p>
        </div>
      </div>
      <div className="grow py-3 overflow-hidden">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1.125rem",
            color: "#C0C0C5",

            paddingBottom: "4px",
            borderBottom: "1px solid #323234",
          }}
        >
          잼 목록
        </p>
        <div
          style={{
            width: "100%",
            height: "95%",
            overflow: "auto",
          }}
        >
          <FlexRow />
          <FlexRow />
          <FlexRow />
          <FlexRow />
          <FlexRow />
          <FlexRow />
          <div className="mt-6 mb-9 relative">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#E5E5E9",

                paddingBottom: "8px",
              }}
            >
              마지막으로 어필 한마디!
            </p>
            <textarea
              placeholder="입력"
              className="w-full px-3 py-2"
              style={{
                height: "72px",

                backgroundColor: "var(--background)",
                border: "1px solid #444447",
                borderRadius: "4px",

                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#767678",
              }}
            />
            <p
              className="absolute right-2 bottom-2"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#767678",
              }}
            >
              0/200
            </p>
          </div>
        </div>
      </div>
      <ButtonTemplate
        text="LET'S JAM!"
        className="px-3 py-2.5 my-2"
        style={{
          width: "100%",

          borderRadius: "8px",
          border: "1px solid #A3FF0C",

          fontFamily: "SBAggroM",
          color: "#A3FF0C",
        }}
      />
    </div>
  );
}
