import Image from "next/image";
import CategoryItemLayout from "../../categories/category-item-layout";

export default function Age() {
  return (
    <CategoryItemLayout>
      <Image src="/categories/age.svg" alt="age" width={20} height={20} />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "1rem",
          color: "#FFFFFF",
        }}
      >
        연령대
      </p>
    </CategoryItemLayout>
  );
}
