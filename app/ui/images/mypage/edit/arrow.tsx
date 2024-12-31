import Image from "next/image";

export const DownArrowOnEditPage = () => {
  return (
    <Image
      src={"/mypage/edit/arrow-down.svg"}
      alt="down arrow"
      width={10}
      height={7}
    />
  );
};
