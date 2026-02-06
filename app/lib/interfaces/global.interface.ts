import { BottomSheetHeight } from "@/app/ui/templates/bottom-sheet/body";
import { ReactNode } from "react";
import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";
import { Entity_Playlist } from "./entity.interface";

// Zustand store와 호환되는 BottomSheet 타입
export interface BottomSheetState {
  children: ReactNode;
  location: BottomSheetHeight;
  header: boolean;
}

export interface BottomSheetContext extends BottomSheetState {
  set: (input: Partial<BottomSheetState>) => void;
  setHeader: (input: boolean) => void;
  close: () => void;
}

export interface UserProfile {
  isLoaded: undefined | boolean;
  id: undefined | string;
  accept_marketing: undefined | boolean;
  profile_image: undefined | null | string;
  nickname: undefined | string;
  tags: undefined | string[];
  pos: undefined | PositionEnum;
  genre: undefined | GenreEnum;
  level: undefined | LevelEnum;
  location: undefined | LocationEnum;
  bpm: undefined | number;
  is_bpm_public: undefined | boolean;
  allow_noti: undefined | boolean;
  playlist: Entity_Playlist[];
}
