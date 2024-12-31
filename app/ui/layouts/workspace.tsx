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
      className="flex flex-col justify-between w-full h-full min-w-full min-h-screen max-h-screen relative"
      style={style}
    >
      {children}
    </div>
  );
}
