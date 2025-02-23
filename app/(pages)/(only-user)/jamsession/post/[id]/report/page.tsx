"use client";

import {
  DownArrow,
  DownArrowWhite,
  LeftArrowWhite,
} from "@/app/ui/images/arrows";
import AlertIcon from "@/app/ui/images/jamsession/post/report/alert";
import ButtonTemplate, {
  ButtonBasicActiveStyle,
} from "@/app/ui/templates/buttons";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useParams } from "next/navigation";
import ReportTypeModal from "./modal";
import { useState } from "react";

const FlexRow = ({ tag, content }: { tag: string; content: any }) => {
  return (
    <div
      className="flex flex-row px-5 py-4 gap-1"
      style={{
        height: "6.37%",
        borderBottom: "1px solid #333335",
      }}>
      <p
        style={{
          width: "19.2%",
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#9F9FA2",
        }}>
        {tag}
      </p>
      <div
        style={{
          width: "66.66%",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
          flexGrow: 1,
        }}>
        {content}
      </div>
    </div>
  );
};

export default function Report() {
  // STATE
  const [isModalOn, setIsModalOn] = useState(false);
  //

  const params = useParams();

  return (
    <div className="grow flex flex-col justify-between">
      <div className="px-4 py-5">
        <ImageWithTxt
          image={<LeftArrowWhite />}
          text="신고하기"
          className="gap-2"
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1rem",
            color: "#FFF",
          }}
        />
      </div>
      <div className="grow flex flex-col">
        <FlexRow tag="신고글" content={"제목이 입력되어 있습니다."} />
        <FlexRow
          tag="신고 유형"
          content={
            <div className="grow flex flex-row justify-between">
              <p style={{ color: "#9F9FA2" }}>선택</p>
              <DownArrowWhite onClick={() => setIsModalOn(!isModalOn)} />
              <ReportTypeModal
                isTurnedOn={isModalOn}
                style={{
                  transform: "translateY(30px)",
                }}
              />
            </div>
          }
        />
        <hr
          style={{
            border: "none",
            borderTop: "3px solid #323234",
          }}
        />
        <div
          className="grow px-5 py-6"
          style={{
            fontFamily: "SUIT-BODY",
          }}>
          <p
            className="mb-5"
            style={{
              fontSize: "1rem",
              color: "#F2F2F4",
            }}>
            신고 내용
          </p>
          <p style={{ fontSize: "0.875rem", color: "#9F9FA2" }}>입력</p>
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "4px solid #323234",
          }}
        />
        <div
          className="flex flex-col gap-1.5 px-4 py-5"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.725rem",
            color: "#E5E5E9",

            marginBottom: "25%",
          }}>
          <ImageWithTxt
            style={{
              alignItems: "start",
            }}
            image={<AlertIcon />}
            text="신고하고자 하는 게시글이 맞는지 다시 한번 확인해주세요."
          />
          <ImageWithTxt
            style={{
              alignItems: "start",
            }}
            image={<AlertIcon />}
            text="허위로 신고하는 경우 재밍 이용 약관에 따라 활동 제한 등 불이익을 받을 수 있습니다."
          />
          <ImageWithTxt
            style={{
              alignItems: "start",
            }}
            image={<AlertIcon />}
            text="신고 제출 시 신고자에게 추가 자료를 요청할 수 있습니다."
          />
          <ImageWithTxt
            style={{
              alignItems: "start",
            }}
            image={<AlertIcon />}
            text="신고자 정보 및 신고 내용은 신고 대상자에게 공개되지 않으나, 사실 관계 확인에 꼭 필요한 신고 내용의 일부는 언급될 수 있습니다."
          />
          <ImageWithTxt
            style={{
              alignItems: "start",
            }}
            image={<AlertIcon />}
            text="신고 대상자는 재밍 이용 약관에 따라 활동 제한 등 불이익을 받을 수 있습니다."
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <ButtonTemplate
          text="제출하기"
          className="w-full"
          style={ButtonBasicActiveStyle}
        />
      </div>
    </div>
  );
}
