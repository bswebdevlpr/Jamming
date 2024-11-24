import Image from "next/image";
import { CSSProperties } from "react";

export const Genre = ({ style }: { style: CSSProperties }) => {
  return (
    <Image
      style={style}
      className="ml-auto"
      src="/signup/profile/genre.svg"
      alt="genre"
      width={347}
      height={119.871}
    />
  );
};
