"use client";

import { CSSProperties, useEffect, useRef } from "react";

const FlexRow = ({ text }: { text: string }) => {
  return <div className="px-3 py-2.5 rounded-md">{text}</div>;
};

export default function ReportTypeModal({
  isTurnedOn,
  style,
}: {
  isTurnedOn: boolean;
  style?: CSSProperties;
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
      className="absolute flex flex-col px-1 py-1 hidden"
      style={{
        width: "270px",
        height: "250px",

        border: "1px solid #323234",
        borderRadius: "6px",
        background: "#242426",

        fontFamily: "SUIT-BODY",
        fontSize: "0.875rem",
        color: "#F2F2F4",

        ...style,
      }}
    >
      {[
        "스팸 홍보/도배글입니다.",
        "불법정보를 포함하고 있습니다.",
        "욕설/혐오/차별적 표현입니다.",
        "개인정보 노출 게시물입니다.",
        "불쾌한 표현이 있습니다.",
        "기타",
      ].map((text, idx) => (
        <FlexRow key={idx} text={text} />
      ))}
    </div>
  );
}
