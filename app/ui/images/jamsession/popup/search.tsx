import Image from "next/image";
import { CSSProperties } from "react";

export const SearchIcon = ({
  onClick,
  style,
}: {
  onClick?: () => void;
  style?: CSSProperties;
}) => {
  return (
    <Image
      src="/jamsession/popup/search.svg"
      alt="search"
      width={20}
      height={20}
      style={{
        cursor: "pointer",

        ...style,
      }}
      onClick={onClick}
    />
  );
};
