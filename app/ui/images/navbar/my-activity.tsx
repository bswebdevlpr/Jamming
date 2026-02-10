import Image from "next/image";

export default function MyActivity({ focused }: { focused: boolean }) {
  return (
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
  );
}
