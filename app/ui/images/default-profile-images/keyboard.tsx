import Image from "next/image";

export const DefaultUserProfileImage_Keyboard = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src="/default-profile-images/keyboard.svg"
      alt="default user profile image - keyboard"
      width={width ?? 68.476}
      height={height ?? 72}
    />
  );
};
