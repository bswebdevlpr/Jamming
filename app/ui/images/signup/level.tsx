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
      className="w-full h-auto"
      src="/signup/profile/band-type.webp"
      alt="band type"
      width={340}
      height={124}
    />
  );
};
