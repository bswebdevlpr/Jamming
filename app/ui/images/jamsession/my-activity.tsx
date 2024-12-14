import Image from "next/image";

export default function MyActivity() {
  return (
    <span className="flex flex-col items-center">
      <Image
        src="/jamsession/my-activity.svg"
        alt="my activity"
        width={20.16}
        height={20.57}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "12px",
          color: "#9F9FA2",
        }}
      >
        내 활동
      </p>
    </span>
  );
}
