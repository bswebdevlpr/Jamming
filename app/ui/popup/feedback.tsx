"use client";

import { useState } from "react";
import PopupTemplate from "@/app/ui/templates/popup";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { createPublicFeedback } from "@/app/api/functions/create";
import { useFeedbackStore } from "@/app/stores";

export default function FeedbackPopup({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
}) {
  const [feedback, setFeedback] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { canSubmit, recordSubmission, getCooldownRemaining } =
    useFeedbackStore();

  const isAvailable = canSubmit();
  const cooldown = getCooldownRemaining();

  const handleSubmit = async () => {
    if (!isAvailable || feedback.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await createPublicFeedback(feedback);
      if (result.success === true) {
        recordSubmission();
        setFeedback("");
        setPlaceholder("피드백 전송이 완료되었어요");
      } else if (result.success === false) {
        setPlaceholder(result.error.message || "피드백 전송이 실패했어요. 나중에 다시 시도해주세요.");
      }
    } catch {
      setPlaceholder("입력 내용을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="w-full flex flex-col pt-7 px-4 pb-5 mx-4"
        style={{
          backgroundColor: "#242426",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            lineHeight: "140%",
            letterSpacing: "-0.45px",
            textAlign: "center",
            color: "var(--foreground)",
            marginBottom: "16px",
          }}
        >
          피드백 보내기
        </p>
        <div className="relative mb-4">
          <textarea
            placeholder={placeholder || "재밍에 대한 의견을 자유롭게 입력해주세요"}
            value={feedback}
            maxLength={100}
            disabled={!isAvailable || isSubmitting}
            className="w-full p-2.5"
            style={{
              height: "104px",
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "var(--foreground)",
              lineHeight: "150%",
              letterSpacing: "-0.3px",
              backgroundColor: "#323234",
              borderRadius: "5px",
            }}
            onChange={(e) => {
              setFeedback(e.currentTarget.value);
              setPlaceholder("");
            }}
          />
          <p
            className="absolute"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
              right: "10px",
              bottom: "10px",
            }}
          >
            {feedback.length} / 100
          </p>
        </div>
        {!isAvailable && cooldown > 0 && (
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#FF3E2F",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            너무 많은 요청이 발생했습니다. {Math.ceil(cooldown / 60)}분 후에
            다시 시도해주세요.
          </p>
        )}
        <div className="flex gap-3">
          <ButtonTemplate
            text="보내기"
            className="basis-1/2"
            isActive={isAvailable && feedback.length > 0 && !isSubmitting}
            onClick={handleSubmit}
          />
          <ButtonTemplate text="닫기" className="basis-1/2" onClick={turnOff} />
        </div>
      </div>
    </PopupTemplate>
  );
}
