import Image from "next/image";

export const GreenNote = () => {
  return (
    <Image src="/note-green.svg" alt="note green" width={24} height={24} />
  );
};
export const GrayNote = () => {
  return <Image src="/note-gray.svg" alt="note gray" width={24} height={24} />;
};
export const PinkNote = () => {
  return <Image src="/note-pink.svg" alt="note pink" width={24} height={24} />;
};
export const BlueNote = () => {
  return <Image src="/note-blue.svg" alt="note blue" width={24} height={24} />;
};
