import Image from "next/image";
import React from "react";

const Kebap = ({
  onClick,
}: {
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}) => {
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
