import Image from "next/image";

export const SignUp_Profile_Background_Position = () => {
  return (
    <Image
      className="w-full h-auto"
      src="/signup/profile/position.svg"
      alt="position"
      width={0}
      height={0}
      priority={true}
      loading="eager"
      // width={347}
      // height={114.422}
    />
  );
};
