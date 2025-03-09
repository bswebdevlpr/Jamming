import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";

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

  playlist: Entity_Playlist[];

  // myact - 멤버관리
  isRejam?: boolean;
}

export interface Entity_JamSession {
  id?: number;
  userId?: string;
  title?: string;
  body?: string;
  pos?: PositionEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  location?: LocationEnum;
  max_head_cnt?: number;
  date?: string;
  created_at?: string;

  // NOT COLUMNS
  curHeadCnt?: number;

  user?: Entity_User;
  jamentry?: Entity_JamEntry[];
}

export interface Entity_JamEntry {
  id: number;
  jamId: number;
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
  thumbnailPath: string;
  author: string;
  date: string;
  is_public: boolean;
}
