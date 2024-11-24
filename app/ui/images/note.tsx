import Image from "next/image";

const Note = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Image
      src={src}
      alt={alt}
      className="inline-block"
      width={24}
      height={24}
    />
  );
};

export const GreenNote = () => {
  return <Note src={"/note-green.svg"} alt={"note green"} />;
};
export const GrayNote = () => {
  return <Note src={"/note-gray.svg"} alt={"note gray"} />;
};
export const PinkNote = () => {
  return <Note src={"/note-pink.svg"} alt={"note pink"} />;
};
export const BlueNote = () => {
  return <Note src={"/note-blue.svg"} alt={"note blue"} />;
};
