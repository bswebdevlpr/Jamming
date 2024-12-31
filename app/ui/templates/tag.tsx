import { CSSProperties } from "react";

export default function Tag({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={`px-1.5 py-0.5 ${className}`}
      style={{
        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        alignItems: "center",

        borderRadius: "2px",

        ...style,
      }}
    >
      {text}
    </p>
  );
}
