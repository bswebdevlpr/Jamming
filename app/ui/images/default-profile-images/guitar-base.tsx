import Image from "next/image";

export const DefaultUserProfileImage_GuitarBase = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src="/default-profile-images/guitar-base.svg"
      alt="default user profile image - guitar-base"
      width={width ?? 66}
      height={height ?? 71}
    />
  );
};
