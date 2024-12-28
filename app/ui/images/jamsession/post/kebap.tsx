import Image from "next/image";

const Kebap = ({ onClick }: { onClick?: () => any }) => {
  return (
    <Image
      src={"/jamsession/post/kebap.svg"}
      alt="kebap menu"
      width={24}
      height={24}
      onClick={onClick}
    />
  );
};
export default Kebap;
