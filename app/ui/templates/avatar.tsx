import * as Avatar from "@radix-ui/react-avatar";
import Logo from "../images/logo";

export default function RadixAvatar({
  width,
  height,
  src,
}: {
  width?: number;
  height?: number;
  src?: null | string;
}) {
  return (
    <Avatar.Root>
      <Avatar.Image
        src={src}
        alt="Avatar"
        style={{
          width: width ?? "140px",
          height: height ?? "140px",

          border: "2px solid var(--highlight)",
          borderRadius: "50%",
        }}
      />
      <Avatar.Fallback
        className="flex justify-center items-center"
        style={{
          width: width ?? "140px",
          height: height ?? "140px",

          border: "2px solid var(--highlight)",
          borderRadius: "50%",
        }}
        delayMs={600}
      >
        <Logo
          width={width ? Number(width) - 20 : 100}
          height={height ? Number(height) - 20 : 100}
        />
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
