import { ReactNode } from "react";
import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";
import { BottomSheetHeight } from "@/app/ui/templates/bottom-sheet/body";
import { ZodType_Image } from "../zod";

export interface BottomSheetContext {
  children: ReactNode;
  location: BottomSheetHeight;
  set: (input: Partial<BottomSheetContext>) => void;
  header?: boolean;
  setHeader: null | ((input: boolean) => void);
}

export interface GlobalContext {
  bodyWidth: number;
  bodyHeight: number;

  isSmallLoadingOn: boolean;
  setSmallLoading: () => void;

  bottomSheet: BottomSheetContext;

  session: {
    userProfile: UserProfile;
    setUserProfile: (input: Partial<UserProfile>) => void;
  };
}

export interface UserProfile {
  isLoaded: undefined | boolean;
  accept_marketing: undefined | boolean;
  profileImage: undefined | null | ZodType_Image;
  nickname: undefined | string;
  tags: undefined | string[];
  position: undefined | PositionEnum;
  genre: undefined | GenreEnum;
  level: undefined | LevelEnum;
  location: undefined | LocationEnum;
}
