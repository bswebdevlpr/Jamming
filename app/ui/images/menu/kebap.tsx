import Image from "next/image";
import { CSSProperties } from "react";

const Kebap = ({ onClick }: { onClick?: (e?: any) => any }) => {
  return (
    <Image
      src={"/menu/kebap.svg"}
      alt="kebap menu"
      width={24}
      height={24}
      onClick={onClick}
    />
  );
};
export default Kebap;
