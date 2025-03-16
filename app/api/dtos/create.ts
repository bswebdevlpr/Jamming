import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";

export interface CreateJamDto {
  user_id: string;
  title: string;
  body: string;
  location: LocationEnum[];
  pos: PositionEnum[];
  genre: GenreEnum[];
  level: LevelEnum[];
  date: string;
  max_head_cnt: number;
}

export interface CreateJamEntryDto {
  user_id: number | string;
  jam_id: number | string;
  appeal: string;
}

export interface CreatePlaylistItemDto {
  user_id: string;
  thumbnail_path: string;
  title: string;
  author: string;
  date: string;
  origin: string;
}
