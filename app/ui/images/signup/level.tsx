import Image from "next/image";

export const SignUp_Profile_Background_Level = () => {
  return (
    <Image
      fill
      src="/signup/profile/band-type.webp"
      alt="band type"
      style={{ objectFit: "fill" }}
      sizes="100vw"
    />
  );
};
