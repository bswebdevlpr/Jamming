import { BottomSheetHeight } from "@/app/ui/templates/bottom-sheet/body";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";

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

  resetSlideCalendarDots: boolean;
  setResetSlideCalendarDots: Dispatch<SetStateAction<boolean>>;
}

export interface UserProfile {
  isLoaded: undefined | boolean;
  accept_marketing: undefined | boolean;
  profile_image: undefined | null | string;
  nickname: undefined | string;
  tags: undefined | string[];
  pos: undefined | PositionEnum;
  genre: undefined | GenreEnum;
  level: undefined | LevelEnum;
  location: undefined | LocationEnum;
}
