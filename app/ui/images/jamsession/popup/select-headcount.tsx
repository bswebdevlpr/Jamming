import Image from "next/image";

const Plus = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Image
      src="/jamsession/popup/plus.svg"
      alt="plus"
      width={24}
      height={24}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
};

const Minus = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Image
      src="/jamsession/popup/minus.svg"
      alt="minus"
      width={24}
      height={24}
      style={{
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

export { Plus, Minus };
