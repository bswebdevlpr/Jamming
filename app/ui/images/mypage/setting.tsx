import Image from "next/image";

export default function SettingIcon({ onClick }: { onClick: () => void }) {
  return (
    <Image
      src="/mypage/setting.svg"
      alt="setting"
      width={24}
      height={24}
      style={{
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
}
