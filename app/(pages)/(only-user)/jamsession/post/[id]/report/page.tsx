"use client";

import { DownArrowWhite, LeftArrowWhite } from "@/app/ui/images/arrows";
import AlertIcon from "@/app/ui/images/jamsession/post/report/alert";
import ButtonTemplate, { ButtonBasicActiveStyle } from "@/app/ui/templates/buttons";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ReportTypeModal from "./modal";
import { useState } from "react";
import { ReportTypeEnum } from "@/app/lib/enums/report.enum";
import { ZodSchema_Report } from "@/app/lib/zod";
import { createReport } from "@/app/api/functions/report";
import { toast } from "@/app/ui/components/toast";

const FlexRow = ({ tag, content }: { tag: string; content: any }) => {
  return (
    <div
      className="flex flex-row px-5 py-4 gap-1"
      style={{
        height: "6.37%",
        borderBottom: "1px solid #333335",
      }}
    >
      <p style={{ width: "19.2%", fontFamily: "SUIT-TITLE", fontSize: "0.875rem", color: "#9F9FA2" }}>
        {tag}
      </p>
      <div style={{ width: "66.66%", fontFamily: "SUIT-BODY", fontSize: "0.875rem", color: "#FFF", flexGrow: 1 }}>
        {content}
      </div>
    </div>
  );
};

export default function Report() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const jamId = Number(params.id as string);
  const jamTitle = searchParams.get("title") ?? "제목 없음";

  const [isModalOn, setIsModalOn] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportTypeEnum | null>(null);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = selectedType !== null && body.trim().length >= 5;

  const handleTypeSelect = (type: ReportTypeEnum) => {
    setSelectedType(type);
    setIsModalOn(false);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    const validation = ZodSchema_Report.safeParse({
      type: selectedType,
      body: body.trim(),
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    const result = await createReport({
      jam_id: jamId,
      type: selectedType,
      body: body.trim(),
    });

    if (result.success === true) {
      toast.success("신고가 접수되었습니다.");
      router.back();
    } else if (result.success === false) {
      toast.error(result.error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grow flex flex-col justify-between">
      <div className="px-4 py-5">
        <ImageWithTxt
          image={<LeftArrowWhite onClick={() => router.back()} />}
          text="신고하기"
          className="gap-2"
          style={{ fontFamily: "SUIT-TITLE", fontSize: "1rem", color: "#FFF" }}
        />
      </div>

      <div className="grow flex flex-col">
        <FlexRow tag="신고글" content={jamTitle} />

        <FlexRow
          tag="신고 유형"
          content={
            <div className="grow flex flex-row justify-between relative">
              <p style={{ color: selectedType ? "#FFF" : "#9F9FA2" }}>
                {selectedType ?? "선택"}
              </p>
              <DownArrowWhite onClick={() => setIsModalOn(!isModalOn)} />
              <ReportTypeModal
                isTurnedOn={isModalOn}
                selectedType={selectedType}
                onSelect={handleTypeSelect}
                style={{ transform: "translateY(30px)" }}
              />
            </div>
          }
        />

        <hr style={{ border: "none", borderTop: "3px solid #323234" }} />

        <div className="grow px-5 py-6" style={{ fontFamily: "SUIT-BODY" }}>
          <p className="mb-5" style={{ fontSize: "1rem", color: "#F2F2F4" }}>
            신고 내용
          </p>
          <div style={{ position: "relative" }}>
            <textarea
              placeholder="신고 사유를 상세히 작성해주세요. (최소 5글자)"
              maxLength={500}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="p-3"
              style={{
                width: "100%",
                minHeight: "120px",
                border: "1px solid #767678",
                borderRadius: "8px",
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#F2F2F4",
                backgroundColor: "transparent",
                resize: "vertical",
              }}
            />
            <p
              style={{
                position: "absolute",
                bottom: 8,
                right: 10,
                fontSize: "0.75rem",
                color: "#9F9FA2",
              }}
            >
              {`${body.length}/500`}
            </p>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "4px solid #323234" }} />

        <div
          className="flex flex-col gap-1.5 px-4 py-5"
          style={{ fontFamily: "SUIT-BODY", fontSize: "0.725rem", color: "#E5E5E9", marginBottom: "25%" }}
        >
          <ImageWithTxt style={{ alignItems: "start" }} image={<AlertIcon />}
            text="신고하고자 하는 게시글이 맞는지 다시 한번 확인해주세요." />
          <ImageWithTxt style={{ alignItems: "start" }} image={<AlertIcon />}
            text="허위로 신고하는 경우 재밍 이용 약관에 따라 활동 제한 등 불이익을 받을 수 있습니다." />
          <ImageWithTxt style={{ alignItems: "start" }} image={<AlertIcon />}
            text="신고 제출 시 신고자에게 추가 자료를 요청할 수 있습니다." />
          <ImageWithTxt style={{ alignItems: "start" }} image={<AlertIcon />}
            text="신고자 정보 및 신고 내용은 신고 대상자에게 공개되지 않으나, 사실 관계 확인에 꼭 필요한 신고 내용의 일부는 언급될 수 있습니다." />
          <ImageWithTxt style={{ alignItems: "start" }} image={<AlertIcon />}
            text="신고 대상자는 재밍 이용 약관에 따라 활동 제한 등 불이익을 받을 수 있습니다." />
        </div>
      </div>

      <div className="px-4 py-2">
        <ButtonTemplate
          text={isSubmitting ? "제출 중..." : "제출하기"}
          className="w-full"
          style={isFormValid ? ButtonBasicActiveStyle : undefined}
          isActive={isFormValid && !isSubmitting}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
