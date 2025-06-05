import Image from "next/image";

export const DefaultUserProfileImage_Drum = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src="/default-profile-images/drum.svg"
      alt="default user profile image - drum"
      width={width ?? 74}
      height={height ?? 72.027}
    />
  );
};
