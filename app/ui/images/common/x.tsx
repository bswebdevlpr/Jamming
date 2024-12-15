import Image from "next/image";

export default function X({ onClick }: { onClick: () => void }) {
  return (
    <Image
      src="/common/x.svg"
      alt="close button"
      width={24}
      height={24}
      onClick={onClick}
    />
  );
}
