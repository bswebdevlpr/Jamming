import Image from "next/image";

export default function FeedbackIcon({ focused }: { focused: boolean }) {
  return (
    <span className="flex flex-col items-center">
      <Image
        src={
          focused
            ? "/navbar/bottom/feedback-green.svg"
            : "/navbar/bottom/feedback-gray.svg"
        }
        alt="feedback"
        width={20}
        height={21}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "12px",
          color: focused ? "#A3FF0C" : "#9F9FA2",
        }}
      >
        문의하기
      </p>
    </span>
  );
}
