import Image from "next/image";
import { CSSProperties } from "react";

export const Camera = ({ style }: { style?: CSSProperties }) => {
  return (
    <Image
      style={style}
      src="/camera.svg"
      alt="camera"
      width={20}
      height={20}
    />
  );
};
