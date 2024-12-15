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

export const DownArrow = () => {
  return (
    <Image src="/arrow-down.svg" alt="arrow-down" width={20} height={20} />
  );
};
