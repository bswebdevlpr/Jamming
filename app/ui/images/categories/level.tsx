import Image from "next/image";
import CategoryItemLayout from "../../categories/category-item-layout";

export default function Level() {
  return (
    <CategoryItemLayout>
      <Image src="/categories/level.svg" alt="level" width={20} height={20} />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "1rem",
          color: "#FFFFFF",
        }}
      >
        레벨
      </p>
    </CategoryItemLayout>
  );
}
