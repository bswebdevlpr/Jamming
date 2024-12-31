import Image from "next/image";

export default function Profile({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/jamsession/profile.svg"
      alt="profile"
      width={width ?? 18.34}
      height={height ?? 20.57}
    />
  );
}
