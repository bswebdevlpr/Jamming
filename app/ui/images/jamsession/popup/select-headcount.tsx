import Image from "next/image";

const Plus = () => {
  return (
    <Image
      src="/jamsession/popup/plus.svg"
      alt="plus"
      width={24}
      height={24}
      style={{ cursor: "pointer" }}
    />
  );
};

const Minus = () => {
  return (
    <Image
      src="/jamsession/popup/minus.svg"
      alt="minus"
      width={24}
      height={24}
      style={{
        cursor: "pointer",
      }}
    />
  );
};

export { Plus, Minus };
