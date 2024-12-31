import Image from "next/image";

export default function CheckboxOnEditPage({
  isClicked,
  onClick,
}: {
  isClicked: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        width: "22px",
        height: "22px",
        overflow: "hidden",

        border: isClicked ? "1px solid var(--highlight)" : "",
        borderRadius: isClicked ? "2px" : "",
        backgroundColor: isClicked ? "var(--highlight)" : "",
      }}
      onClick={onClick}
    >
      <Image
        src="/mypage/edit/checkbox.svg"
        alt="checkbox"
        width={22}
        height={22}
      />
    </div>
  );
}
