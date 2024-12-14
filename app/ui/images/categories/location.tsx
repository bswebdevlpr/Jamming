import Image from "next/image";
import CategoryItemLayout from "../../categories/category-item-layout";

export default function Location() {
  return (
    <CategoryItemLayout>
      <Image
        src="/categories/location.svg"
        alt="location"
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
        경기
      </p>
    </CategoryItemLayout>
  );
}
