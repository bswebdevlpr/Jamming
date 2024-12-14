import Image from "next/image";

export default function Calendar() {
  return (
    <div
      className="w-7 h-7 flex justify-center items-center"
      style={{
        backgroundColor: "#242426",
      }}
    >
      <Image
        src="/jamsession/calendar.svg"
        alt="calendar"
        width={16}
        height={16}
      />
    </div>
  );
}
