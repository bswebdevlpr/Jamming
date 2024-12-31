import Image from "next/image";

export default function Profile({
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
          ? "/navbar/bottom/profile-green.svg"
          : "/navbar/bottom/profile.svg"
      }
      alt="profile"
      width={width ?? 18.34}
      height={height ?? 20.57}
    />
  );
}
