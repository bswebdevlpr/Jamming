import Image from "next/image";
import { CSSProperties } from "react";

export default function X({
  width,
  height,
  onClick,
  className,
  style,
}: {
  width?: number;
  height?: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src="/common/x.svg"
      alt="close button"
      width={width ?? 24}
      height={height ?? 24}
      onClick={onClick}
      className={className}
      style={{
        cursor: "pointer",
        ...style,
      }}
    />
  );
}
