import Image from "next/image";

export const RightArrow = () => {
  return (
    <Image
      className="ml-auto"
      src="/arrow-right.svg"
      alt="arrow-right"
      width={20}
      height={20}
    />
  );
};
