import Image from "next/image";
import { CSSProperties } from "react";

export const SignUp_Profile_Background_Genre = ({
  style,
}: {
  style: CSSProperties;
}) => {
  return (
    <Image
      style={style}
      className="w-full h-auto"
      src="/signup/profile/genre.webp"
      alt="genre"
      width={340}
      height={120}
    />
  );
};
