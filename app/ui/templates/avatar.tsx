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
  const fallbackContentWidth = width ? width * 0.7 : 100,
    fallbackContentHeight = height ? height * 0.7 : 100;

  pos = MapDataToPosition[pos];

  return (
    <Avatar.Root>
      <Avatar.Image
        src={src}
        alt="Avatar"
        style={{
          width: width ? `${width}px` : "140px",
          height: height ? `${height}px` : "140px",
          borderRadius: "50%",
        }}
      />
      <Avatar.Fallback
        className="flex justify-center items-center"
        style={{
          width: width ? `${width}px` : "140px",
          height: height ? `${height}px` : "140px",

          border: "1.5px solid var(--highlight)",
          borderRadius: "50%",
        }}
        delayMs={600}
      >
        {pos === PositionEnum.Drum ? (
          <DefaultUserProfileImage_Drum
            width={fallbackContentWidth}
            height={fallbackContentHeight}
          />
        ) : pos === PositionEnum.Guitar || pos === PositionEnum.Base ? (
          <DefaultUserProfileImage_GuitarBase
            width={fallbackContentWidth}
            height={fallbackContentHeight}
          />
        ) : pos === PositionEnum.Keyboard ? (
          <DefaultUserProfileImage_Keyboard
            width={fallbackContentWidth}
            height={fallbackContentHeight}
          />
        ) : pos === PositionEnum.Vocal ? (
          <DefaultUserProfileImage_Vocal
            width={fallbackContentWidth}
            height={fallbackContentHeight}
          />
        ) : (
          <Logo width={fallbackContentWidth} height={fallbackContentHeight} />
        )}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
