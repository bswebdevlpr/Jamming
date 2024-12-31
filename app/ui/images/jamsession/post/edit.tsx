import Image from "next/image";
import { CSSProperties } from "react";

const EditIcon = ({ style }: { style?: CSSProperties }) => {
  return (
    <Image
      src={"/jamsession/post/edit.svg"}
      alt="edit"
      width={20}
      height={20}
      style={style}
    />
  );
};
export default EditIcon;
