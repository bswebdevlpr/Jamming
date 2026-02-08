import Image from "next/image";

export default function LoginIcon() {
  return (
    <span className="flex flex-col items-center">
      <Image
        src="/navbar/bottom/login-gray.svg"
        alt="login"
        width={20}
        height={21}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "12px",
          color: "#9F9FA2",
        }}
      >
        로그인
      </p>
    </span>
  );
}
