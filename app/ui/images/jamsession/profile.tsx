import Image from "next/image";

export default function Profile() {
  return (
    <span className="flex flex-col items-center">
      <Image
        src="/jamsession/profile.svg"
        alt="profile"
        width={18.34}
        height={20.57}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "12px",
          color: "#9F9FA2",
        }}
      >
        프로필
      </p>
    </span>
  );
}
