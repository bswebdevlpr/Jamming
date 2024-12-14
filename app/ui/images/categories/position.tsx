import Image from "next/image";
import CategoryItemLayout from "../../categories/category-item-layout";

export default function Position() {
  return (
    <CategoryItemLayout>
      <Image
        src="/categories/position.svg"
        alt="position"
        width={20}
        height={20}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "1rem",
          color: "#FFFFFF",
        }}
      >
        기타
      </p>
    </CategoryItemLayout>
  );
}
