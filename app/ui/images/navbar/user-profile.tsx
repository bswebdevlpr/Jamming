import Image from "next/image";

export default function UserProfile({
  width,
  height,
  focused,
}: {
  width?: number;
  height?: number;
  focused?: boolean;
}) {
  return (
    <Image
      src={
        focused
          ? "/navbar/bottom/user-profile--green.svg"
          : "/navbar/bottom/user-profile.svg"
      }
      alt="user profile"
      width={width ?? 18.34}
      height={height ?? 20.57}
    />
  );
}
