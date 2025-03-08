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
          width: width ?? "80px",
          height: height ?? "80px",
        }}
      >
        <Avatar.Image
          src={src ?? undefined}
          alt="Avatar"
          style={{
            width: width ?? "80px",
            height: height ?? "80px",
          }}
        />
        <Avatar.Fallback
          className="flex justify-center items-center"
          style={{
            width: width ?? "80px",
            height: height ?? "80px",

            border: "2px solid var(--highlight)",
            borderRadius: "50%",
            padding: "5px",
          }}
          delayMs={600}
        >
          <Logo
            width={width ? Number(width) - 20 : 60}
            height={height ? Number(height) - 20 : 60}
          />
        </Avatar.Fallback>
      </div>
    </Avatar.Root>
  );
}
