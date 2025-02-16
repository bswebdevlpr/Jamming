import { GenreEnum } from "../constants/genre.enum";
import { LevelEnum } from "../constants/level.enum";
import { LocationEnum } from "../constants/location.enum";
import { PositionEnum } from "../constants/position.enum";

export interface Entity_User {
  nickname: string;
  pos: PositionEnum;
  genre: GenreEnum;
  level: LevelEnum;
  bpm: number;
}

export interface Entity_JamSession {
  id: number;
  title: string;
  body: string;
  pos: PositionEnum;
  genre: GenreEnum;
  level: LevelEnum;
  location: LocationEnum;
  maxHeadCnt: number;
  date: string;
  created_at: string;

  user: Entity_User;
}
