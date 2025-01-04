"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Kebap from "@/app/ui/images/menu/kebap";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { ReactNode, useContext, useEffect, useState } from "react";
import { globalContext } from "../../layout";
import ButtonTemplate from "@/app/ui/templates/buttons";
import NoshowPopup from "./popup/noshow";
import RejamPopup from "./popup/rejam";
import RadixAvatar from "@/app/ui/templates/avatar";

const FlexRow = ({
  picture,
  kebap,
}: {
  picture: ReactNode;
  kebap: ReactNode;
}) => {
  return (
    <div
      className="flex flex-row items-start py-4 gap-5"
      style={{
        borderBottom: "1px solid #242426",
      }}
    >
      {picture}
      <div className="grow flex flex-col gap-2">
        <div className="flex flex-row gap-1.5">
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#F2F2F4",
            }}
          >
            닉네임
          </p>
          <p
            className="text-center px-1.5 py-0.5"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              color: "#F2F2F4",

              borderRadius: "100px",
              border: "0.8px solid #767678",
            }}
          >
            포지션
          </p>
          <p
            className="text-center px-1.5 py-0.5"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              color: "#F2F2F4",

              borderRadius: "100px",
              border: "0.8px solid #767678",
            }}
          >
            장르
          </p>
        </div>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}
        >
          한줄 소개가 들어갑니다. 한줄 소개가 들어갑니다.한줄 소개가 들어갑니다.
        </p>
      </div>
      {kebap}
    </div>
  );
};

export default function History() {
  // INIT
  const { bottomSheet } = useContext(globalContext);
  useEffect(() => {
    if (bottomSheet.setHeader) bottomSheet.setHeader(false);
  }, []);
  //

  // STATES
  const [isNoshowOn, setIsNoshowOn] = useState(false);
  const [isRejamOn, setIsRejamOn] = useState(false);
  //

  const customedKebap = Kebap({
    onClick: () =>
      bottomSheet.setter({
        location: 24,
        children: (
          <div className="flex flex-col px-4 pt-2 pb-3">
            <p
              className="w-full px-3 py-3.5 text-center"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "15px",
                color: "#F2F2F4",

                borderBottom: "1px solid #323234",
              }}
              onClick={() => {
                bottomSheet.setter({ location: "hidden" });
                setIsRejamOn(true);
              }}
            >
              REJAM!
            </p>
            <p
              className="w-full px-3 py-3.5 text-center"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "15px",
                color: "#F2F2F4",
              }}
              onClick={() => {
                bottomSheet.setter({ location: "hidden" });
                setIsNoshowOn(true);
              }}
            >
              노쇼 체크
            </p>
            <ButtonTemplate
              text="취소"
              className="w-full my-3"
              style={{
                backgroundColor: "#323234",

                border: "1px solid #444447",
                borderRadius: "8px",
              }}
              onClick={() => bottomSheet.setter({ location: "hidden" })}
            />
          </div>
        ),
      }),
  });

  return (
    <div className="grow flex flex-col px-4 mb-3">
      <ImageWithTxt
        image={<LeftArrowWhite />}
        text="멤버 보기"
        className="gap-2 py-3"
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#FFF",
        }}
      />
      <FlexRow
        picture={
          <RadixAvatar
            width={52}
            height={52}
            src="/samples/history-yellow.jpg"
          />
        }
        kebap={customedKebap}
      />
      <FlexRow
        picture={
          <RadixAvatar width={52} height={52} src="/samples/history-red.jpg" />
        }
        kebap={customedKebap}
      />
      <FlexRow
        picture={
          <RadixAvatar
            width={52}
            height={52}
            src="/samples/history-purple.jpg"
          />
        }
        kebap={customedKebap}
      />
      <FlexRow
        picture={
          <RadixAvatar
            width={52}
            height={52}
            src="/samples/history-yellow.jpg"
          />
        }
        kebap={customedKebap}
      />
      <NoshowPopup
        isTurnedOn={isNoshowOn}
        turnOff={() => setIsNoshowOn(false)}
      />
      <RejamPopup isTurnedOn={isRejamOn} turnOff={() => setIsRejamOn(false)} />
    </div>
  );
}
