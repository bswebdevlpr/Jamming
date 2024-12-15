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
      className="flex flex-col justify-between min-w-full min-h-screen"
      style={style}
    >
      {children}
    </div>
  );
}
