import Image from "next/image";
import { CSSProperties } from "react";

const MeatballMenu = ({
  onClick,
  style,
}: {
  onClick?: () => any;
  style?: CSSProperties;
}) => {
  return (
    <Image
      src={"/menu/meatball.svg"}
      alt="meatball menu"
      width={24}
      height={24}
      onClick={onClick}
      style={style}
    />
  );
};
export default MeatballMenu;
