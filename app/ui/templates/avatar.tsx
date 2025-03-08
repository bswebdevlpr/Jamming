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
      <div
        className="inline-flex justify-center items-center align-middle overflow-hidden rounded-full"
        style={{
          width: width ?? "140px",
          height: height ?? "140px",

          border: "1px solid var(--highlight)",
          borderRadius: "50%",
          padding: "5px",
        }}
      >
        <Avatar.Image
          src={src}
          alt="Avatar"
          style={{
            width: width ? Number(width) - 40 : "100px",
            height: height ? Number(height) - 40 : "100px",
          }}
        />
        <Avatar.Fallback
          className="flex justify-center items-center"
          style={{
            width: width ?? "140px",
            height: height ?? "140px",
          }}
          delayMs={600}
        >
          <Logo
            width={width ? Number(width) - 20 : 100}
            height={height ? Number(height) - 20 : 100}
          />
        </Avatar.Fallback>
      </div>
    </Avatar.Root>
  );
}
