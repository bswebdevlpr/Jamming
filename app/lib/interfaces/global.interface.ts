import { ReactNode } from "react";
import { GenreEnum } from "../constants/genre.enum";
import { LevelEnum } from "../constants/level.enum";
import { LocationEnum } from "../constants/location.enum";
import { PositionEnum } from "../constants/position.enum";
import { ImageFile } from "./zod.interface";
import { BottomSheetHeight } from "@/app/ui/templates/bottom-sheet/body";

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
  acceptMarketing: undefined | boolean;
  profileImage: undefined | null | ImageFile;
  nickname: undefined | string;
  tags: undefined | string[];
  position: undefined | PositionEnum;
  genre: undefined | GenreEnum;
  level: undefined | LevelEnum;
  location: undefined | LocationEnum;
}
