import Image from "next/image";

export const RightArrow = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      className="ml-auto"
      src="/common/arrows/arrow-right.svg"
      alt="arrow right"
      width={width ?? 20}
      height={height ?? 20}
      style={{ cursor: "pointer" }}
    />
  );
};

export const DownArrow = () => {
  return (
    <Image
      src="/common/arrows/arrow-down.svg"
      alt="arrow down"
      width={20}
      height={20}
      style={{ cursor: "pointer" }}
    />
  );
};
export const DownArrowWhite = () => {
  return (
    <Image
      src="/common/arrows/arrow-down-white.svg"
      alt="arrow down"
      width={16}
      height={16}
      style={{ cursor: "pointer" }}
    />
  );
};

export const LeftArrow: React.FC = () => {
  return (
    <Image
      src="/common/arrows/arrow-left.svg"
      alt="arrow left"
      width={20}
      height={20}
      style={{ cursor: "pointer" }}
    />
  );
};
export const LeftArrowWhite: React.FC = () => {
  return (
    <Image
      src="/common/arrows/arrow-left-white.svg"
      alt="whitearrow left"
      width={20}
      height={20}
      style={{ cursor: "pointer" }}
    />
  );
};
