import Image from "next/image";
import { CSSProperties } from "react";

export default function Love({
  width,
  height,
  className,
  style,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src="/love.svg"
      alt="love"
      width={width ?? 25}
      height={height ?? 22.67}
      className={className}
      style={style}
    />
  );
}
