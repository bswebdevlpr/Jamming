import Image from "next/image";

export const SignUp_Profile_Background_Position = () => {
  return (
    <Image
      fill
      src="/signup/profile/position.webp"
      alt="position"
      style={{ objectFit: "fill" }}
      sizes="100vw"
    />
  );
};
