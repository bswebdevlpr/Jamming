import Image from "next/image";

export default function Logo({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/logo.svg"
      alt="logo"
      width={width ?? 28}
      height={height ?? 28}
    />
  );
}
