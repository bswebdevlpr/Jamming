import Image from "next/image";

export const SignUp_Profile_Background_Genre = () => {
  return (
    <Image
      fill
      src="/signup/profile/genre.webp"
      alt="genre"
      style={{ objectFit: "fill" }}
      sizes="100vw"
    />
  );
};
