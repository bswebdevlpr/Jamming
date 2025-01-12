import Image from "next/image";
import { CSSProperties } from "react";

export const SignUp_Profile_Background_Level = ({
  style,
}: {
  style: CSSProperties;
}) => {
  return (
    <Image
      style={style}
      className="ml-auto w-full h-auto"
      src="/signup/profile/band-type.svg"
      alt="band type"
      width={0}
      height={0}
      // width={347}
      // height={123.41}
    />
  );
};
