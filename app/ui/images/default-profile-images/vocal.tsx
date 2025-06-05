import Image from "next/image";

export const DefaultUserProfileImage_Vocal = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src="/default-profile-images/vocal.svg"
      alt="default user profile image - vocal"
      width={width ?? 58.036}
      height={height ?? 75}
    />
  );
};
