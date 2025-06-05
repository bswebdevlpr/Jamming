import * as Avatar from "@radix-ui/react-avatar";
import Logo from "../images/logo";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { DefaultUserProfileImage_Drum } from "../images/default-profile-images/drum";
import { DefaultUserProfileImage_GuitarBase } from "../images/default-profile-images/guitar-base";
import { DefaultUserProfileImage_Keyboard } from "../images/default-profile-images/keyboard";
import { DefaultUserProfileImage_Vocal } from "../images/default-profile-images/vocal";
import { MapDataToPosition } from "@/app/lib/maps/jam";

export default function RadixAvatar({
  width,
  height,
  src,
  pos,
}: {
  width?: number;
  height?: number;
  src?: null | string;
  pos?: string;
}) {
  pos = MapDataToPosition[pos];

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
        {pos === PositionEnum.Drum ? (
          <DefaultUserProfileImage_Drum width={width} height={height} />
        ) : pos === PositionEnum.Guitar || pos === PositionEnum.Base ? (
          <DefaultUserProfileImage_GuitarBase width={width} height={height} />
        ) : pos === PositionEnum.Keyboard ? (
          <DefaultUserProfileImage_Keyboard width={width} height={height} />
        ) : pos === PositionEnum.Vocal ? (
          <DefaultUserProfileImage_Vocal width={width} height={height} />
        ) : (
          <Logo
            width={width ? Number(width) - 20 : 100}
            height={height ? Number(height) - 20 : 100}
          />
        )}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
