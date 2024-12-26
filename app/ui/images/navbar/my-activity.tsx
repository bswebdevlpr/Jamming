import Image from "next/image";

export default function MyActivity({ focused }: { focused: boolean }) {
  return (
    <span className="flex flex-col items-center">
      <Image
        src={
          focused
            ? "/navbar/bottom/note-green.svg"
            : "/navbar/bottom/note-gray.svg"
        }
        alt="my activity"
        width={20.16}
        height={20.57}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "12px",
          color: focused ? "#A3FF0C" : "#9F9FA2",
        }}
      >
        내 활동
      </p>
    </span>
  );
}
