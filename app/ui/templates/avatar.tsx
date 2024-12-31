import * as Avatar from "@radix-ui/react-avatar";
import Logo from "../images/logo";

export default function RadixAvatar({
  width,
  height,
  src,
}: {
  width?: number;
  height?: number;
  src?: string;
}) {
  return (
    <Avatar.Root>
      <div
        className="inline-flex justify-center items-center align-middle overflow-hidden rounded-full"
        style={{
          width: width ?? "140px",
          height: height ?? "140px",
        }}
      >
        <Avatar.Image
          src={src}
          alt="Avatar"
          style={{
            width: width ?? "140px",
            height: height ?? "140px",
          }}
        />
        <Avatar.Fallback
          className="flex justify-center items-center"
          style={{
            width: width ?? "140px",
            height: height ?? "140px",

            border: "2px solid var(--highlight)",
            borderRadius: "50%",
            padding: "5px",
          }}
          // delayMs={600}
        >
          <Logo width={90} height={90} />
        </Avatar.Fallback>
      </div>
    </Avatar.Root>
  );
}
