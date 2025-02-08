import Image from "next/image";

export default function CalendarImage({ onClick }: { onClick?: () => void }) {
  return (
    <Image
      src="/jamsession/calendar.svg"
      alt="calendar"
      width={20}
      height={20}
      onClick={onClick}
    />
  );
}
