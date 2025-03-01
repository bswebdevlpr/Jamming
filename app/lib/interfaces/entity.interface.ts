import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";

export interface Entity_User {
  id?: string;
  nickname?: string;
  pos?: PositionEnum;
  genre?: GenreEnum;
  level?: LevelEnum;
  bpm?: number;
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

  user?: Entity_User;
  jamentry?: Entity_JamEntry[];
}

export interface Entity_JamEntry {
  id: number;
  jamId: number;
  userId: string;
}
