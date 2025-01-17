import { CSSProperties } from "react";

export default function InitButton({
  style,
  onClick,
}: {
  style?: CSSProperties;
  onClick: () => void;
}) {
  return (
    <div
      className="flex justify-center items-center text-base"
      style={{
        width: "29.85%",
        height: "2.75rem",

        border: "1px solid #535355",
        borderRadius: "0.5rem",

        backgroundColor: "#323234",

        fontFamily: "SUIT-BODY",
        fontSize: "1rem",

        cursor: "pointer",

        ...style,
      }}
      onClick={onClick}
    >
      초기화
    </div>
  );
}
