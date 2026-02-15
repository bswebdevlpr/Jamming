"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { ReportTypeEnum } from "@/app/lib/enums/report.enum";

const FlexRow = ({
  text,
  isSelected,
  onClick,
}: {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="px-3 py-2.5 rounded-md"
      style={{
        cursor: "pointer",
        backgroundColor: isSelected ? "rgba(255, 62, 47, 0.12)" : "transparent",
        color: isSelected ? "#FF3E2F" : "#F2F2F4",
      }}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default function ReportTypeModal({
  isTurnedOn,
  selectedType,
  onSelect,
  style,
}: {
  isTurnedOn: boolean;
  selectedType: ReportTypeEnum | null;
  onSelect: (type: ReportTypeEnum) => void;
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
        zIndex: 10,
        ...style,
      }}
    >
      {Object.values(ReportTypeEnum).map((type, idx) => (
        <FlexRow
          key={idx}
          text={type}
          isSelected={selectedType === type}
          onClick={() => onSelect(type)}
        />
      ))}
    </div>
  );
}
