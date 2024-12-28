"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import Kebap from "@/app/ui/images/jamsession/post/kebap";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { ReactNode, useContext } from "react";
import { globalContext } from "../../layout";
import ButtonTemplate from "@/app/ui/templates/buttons";

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
  const { bottomSheet } = useContext(globalContext);

  const customedKebap = Kebap({
    onClick: () =>
      bottomSheet.setter({
        location: "low",
        children: (
          <div className="flex flex-col items-center px-4 pt-2 pb-3">
            <p
              className="w-full px-3 py-3.5"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "15px",
                color: "#F2F2F4",

                borderBottom: "1px solid #323234",
              }}
            >
              REJAM!
            </p>
            <p
              className="w-full px-3 py-3.5 mb-3"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "15px",
                color: "#F2F2F4",
              }}
            >
              노쇼 체크
            </p>
            <ButtonTemplate text="취소" className="w-full" />
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
          <div
            className="shrink-0"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "100px",
              background:
                "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
              backgroundBlendMode: "color, normal",
            }}
          />
        }
        kebap={customedKebap}
      />
      <FlexRow
        picture={
          <div
            className="shrink-0"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "100px",
              background:
                "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
            }}
          />
        }
        kebap={customedKebap}
      />
      <FlexRow
        picture={
          <div
            className="shrink-0"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background:
                "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
            }}
          />
        }
        kebap={customedKebap}
      />
      <FlexRow
        picture={
          <div
            className="shrink-0"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background:
                "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
            }}
          />
        }
        kebap={customedKebap}
      />
    </div>
  );
}
