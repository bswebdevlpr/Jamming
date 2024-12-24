import Image from "next/image";

const DeleteIcon = () => {
  return (
    <Image
      src={"/jamsession/post/delete.svg"}
      alt="delete"
      width={17.5}
      height={17.5}
    />
  );
};
export default DeleteIcon;
