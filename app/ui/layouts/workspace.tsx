import { CSSProperties } from "react";

export default function WorkSpace({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className="w-full h-full flex flex-col justify-between relative overflow-without-scroll"
      style={{ ...style, overflowX: "hidden" }}
    >
      {children}
    </div>
  );
}
