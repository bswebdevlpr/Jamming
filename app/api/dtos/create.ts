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
  headcnt_by_pos: number;
}

export interface CreateJamEntryDto {
  user_id: number | string;
  jam_id: number | string;
  appeal: string;
  applied_pos: string;
  is_rejam?: boolean;
}

export interface CreatePlaylistItemDto {
  user_id: string;
  thumbnail_path: string;
  title: string;
  author: string;
  date: string;
  origin: string;
}

// ========== 밴드 관리 ==========

export interface CreateBandDto {
  leader_id: string;
  name: string;
  description?: string;
  genre: GenreEnum[];
  location: LocationEnum;
  level: LevelEnum;
  tags?: string[];
}

export interface CreateBandMemberDto {
  band_id: string;
  user_id: string;
  pos: PositionEnum;
  role: "leader" | "member";
  is_public?: boolean;
}

// ========== 구인 게시판 ==========

export interface CreateRecruitPostDto {
  band_id: string;
  user_id: string;
  title: string;
  body: string;
  positions: { pos: string; headcnt: number }[];
  songs?: { title: string; artist: string; album_cover_url: string }[];
  images?: string[];
  video_url?: string;
  openchat?: string;
  deadline?: string;
}

export interface CreateRecruitCommentDto {
  recruit_id: string;
  user_id: string;
  body: string;
  applied_pos: PositionEnum;
}

// ========== 신고 ==========

export interface CreateReportDto {
  jam_id: number;
  type: string;
  body: string;
}
