import Image from "next/image";

export const SearchIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Image
      src="/jamsession/popup/search.svg"
      alt="search"
      width={20}
      height={20}
      style={{
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};
