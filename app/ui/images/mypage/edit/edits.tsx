import Image from "next/image";
import { CSSProperties } from "react";

export const EditLightGrayIcon = ({
  style,
  onClick,
}: {
  style?: CSSProperties;
  onClick?: () => void;
}) => {
  return (
    <Image
      src={"/mypage/edit/edit-light-gray.svg"}
      alt="edit"
      width={12}
      height={12}
      style={style}
      onClick={onClick}
    />
  );
};

export const EditGrayIcon = ({
  width,
  height,
  style,
  onClick,
}: {
  width?: number;
  height?: number;
  style: CSSProperties;
  onClick?: () => void;
}) => {
  return (
    <Image
      src={"/mypage/edit/edit-gray.svg"}
      alt="edit"
      width={width ?? 28}
      height={height ?? 28}
      style={style}
      onClick={onClick}
    />
  );
};
