import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";
import { ZodType_HeadCnt, ZodType_LocationDetail, ZodType_Song } from "../zod";

export interface Entity_User {
  id?: string;
  nickname?: string;
  profile_image?: string;
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
  images?: string[];
  openchat?: string;
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
  jamsession?: Entity_JamSession;
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

export interface RejamNotificationData {
  jam_ids: number[];
  sender_id: string;
  sender_nickname: string;
}

export interface Entity_Notification {
  id: number;
  user_id: string;
  type:
    | "rejam"
    | "invite"
    | "system"
    | "band_invite"
    | "band_kick"
    | "band_new_member"
    | "recruit_apply"
    | "recruit_accept"
    | "recruit_reject";
  title: string;
  body?: string;
  data?: Record<string, any> | RejamNotificationData;
  is_read: boolean;
  created_at: string;
}

export interface Entity_Band {
  id?: number;
  leader_id?: string;
  name?: string;
  description?: string;
  genre?: GenreEnum[];
  location?: LocationEnum;
  level?: LevelEnum;
  profile_image?: string;
  tags?: string[];
  created_at?: string;

  // Relations
  leader?: Entity_User;
  band_member?: Entity_BandMember[];

  // NOT COLUMNS (계산 필드)
  memberCount?: number;
}

export interface Entity_BandMember {
  id: number;
  band_id: number;
  user_id: string;
  pos: PositionEnum;
  role: "leader" | "member";
  is_public?: boolean;
  joined_at?: string;

  // Relations
  user?: Entity_User;
  band?: Entity_Band;
}

export interface Entity_RecruitPost {
  id?: number;
  band_id?: number;
  user_id?: string;
  title?: string;
  body?: string;
  positions?: ZodType_HeadCnt[];
  genre?: GenreEnum[];
  level?: LevelEnum[];
  location?: LocationEnum;
  songs?: ZodType_Song[];
  images?: string[];
  video_url?: string;
  openchat?: string;
  view_count?: number;
  deadline?: string;
  is_active?: boolean;
  created_at?: string;

  // Relations
  band?: Entity_Band;
  user?: Entity_User;
  recruit_comment?: Entity_RecruitComment[];

  // NOT COLUMNS (계산 필드)
  commentCount?: number;
  appliedPosDict?: Record<string, number>;
}

export interface Entity_RecruitComment {
  id: number;
  recruit_id: number;
  user_id: string;
  body: string;
  applied_pos: PositionEnum;
  is_accepted: boolean | null;
  created_at?: string;

  // Relations
  user?: Entity_User;
  recruit_post?: Entity_RecruitPost;
}
