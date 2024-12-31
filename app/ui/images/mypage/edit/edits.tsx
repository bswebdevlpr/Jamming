import Image from "next/image";
import { CSSProperties } from "react";

export const EditLightGrayIcon = () => {
  return (
    <Image
      src={"/mypage/edit/edit-light-gray.svg"}
      alt="edit"
      width={12}
      height={12}
    />
  );
};

export const EditGrayIcon = ({ style }: { style: CSSProperties }) => {
  return (
    <Image
      src={"/mypage/edit/edit-gray.svg"}
      alt="edit"
      width={28}
      height={28}
      style={style}
    />
  );
};
