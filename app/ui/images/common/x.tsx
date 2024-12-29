import Image from "next/image";
import { CSSProperties } from "react";

export default function X({
  onClick,
  className,
  style,
}: {
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src="/common/x.svg"
      alt="close button"
      width={24}
      height={24}
      onClick={onClick}
      className={className}
      style={{
        cursor: "pointer",
        ...style,
      }}
    />
  );
}
