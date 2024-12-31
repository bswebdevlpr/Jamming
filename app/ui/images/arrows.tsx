import Image from "next/image";

export const RightArrow = ({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <Image
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
export const DownArrowWhite = ({ onClick }: { onClick: () => void }) => {
  return (
    <Image
      src="/common/arrows/arrow-down-white.svg"
      alt="arrow down"
      width={16}
      height={16}
      style={{ cursor: "pointer" }}
      onClick={onClick}
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
export const LeftArrowWhite = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Image
      src="/common/arrows/arrow-left-white.svg"
      alt="whitearrow left"
      width={20}
      height={20}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
};
