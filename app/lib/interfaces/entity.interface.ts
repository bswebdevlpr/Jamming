import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";
import { ZodType_HeadCnt, ZodType_LocationDetail, ZodType_Song } from "../zod";

export interface Entity_User {
  id?: string;
  nickname?: string;
  location?: LocationEnum;
  pos?: PositionEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  tags?: string[];
  bpm?: number;
  is_bpm_public?: boolean;
  allow_noti?: boolean;

  playlist: Entity_Playlist[];

  // myact - 멤버관리
  isRejam?: boolean;
}

export interface Entity_JamSession {
  id?: number;
  user_id?: string;
  title?: string;
  body?: string;
  location?: LocationEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  datetime?: string;
  location_detail?: ZodType_LocationDetail;
  headcnt_by_pos?: ZodType_HeadCnt[];
  songs?: ZodType_Song[];
  created_at?: string;

  // NOT COLUMNS
  curHeadCnt?: number;
  maxHeadCnt?: number;
  appliedPosDict?: {
    [key: string]: number;
  };

  user?: Entity_User;
  jamentry?: Entity_JamEntry[];
}

export interface Entity_JamEntry {
  id: number;
  jam_id: number;
  user_id: string;
  appeal: string;
  applied_pos: string;
  is_allowed: boolean;
  is_rejam: boolean;

  user?: Entity_User;
}

export interface Entity_Playlist {
  id: number;
  user_id: string;
  title: string;
  thumbnail_path: string;
  author: string;
  date: string;
  is_public: boolean;
  origin: string;
}
