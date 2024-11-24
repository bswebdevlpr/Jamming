import Image from "next/image";
import { CSSProperties } from "react";

export const BandType = ({ style }: { style: CSSProperties }) => {
  return (
    <Image
      style={style}
      className="ml-auto"
      src="/signup/profile/band-type.svg"
      alt="band type"
      width={347}
      height={123.41}
    />
  );
};
