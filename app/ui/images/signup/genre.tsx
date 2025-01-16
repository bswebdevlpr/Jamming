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
      src="/signup/profile/genre.svg"
      alt="genre"
      width={0}
      height={0}
      priority={true}
      loading="eager"
      // width={347}
      // height={119.871}
    />
  );
};
