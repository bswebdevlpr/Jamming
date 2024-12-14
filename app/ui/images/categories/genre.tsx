import Image from "next/image";
import CategoryItemLayout from "../../categories/category-item-layout";

export default function Genre() {
  return (
    <CategoryItemLayout>
      <Image src="/categories/genre.svg" alt="genre" width={20} height={20} />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "1rem",
          color: "#FFFFFF",
        }}
      >
        재즈
      </p>
    </CategoryItemLayout>
  );
}
