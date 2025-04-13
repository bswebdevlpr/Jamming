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
      className="flex flex-col justify-between w-full h-[calc(var(--vh)_*_100)] min-w-full min-h-screen max-h-screen relative overflow-without-scroll"
      style={style}
    >
      {children}
    </div>
  );
}
