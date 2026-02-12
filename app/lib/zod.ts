import { z } from "zod";
import { PositionEnum } from "./enums/position.enum";
import { GenreEnum } from "./enums/genre.enum";
import { LevelEnum } from "./enums/level.enum";
import { LocationEnum } from "./enums/location.enum";

const ZodSchema_Image = z.object({
  file: z.any(),
  thumbnail: z.string(),
});
export type ZodType_Image = z.infer<typeof ZodSchema_Image>;

export const ZodSchema_User = z.object({
  accept_marketing: z.boolean(),
  nickname: z
    .string()
    .min(1, { message: "닉네임을 입력해주세요" })
    .max(8, { message: "닉네임을 입력해주세요" })
    .regex(
      /^[a-zA-Z가-힣0-9]+$/, // 알파벳, 숫자, 한글만 허용
      "올바른 닉네임을 입력해주세요"
    ),
  tags: z
    .array(z.string())
    .refine((arr) => arr.every((item) => /^#[가-힣a-zA-Z]+$|^$/.test(item)), {
      message: "태그에는 올바른 문장을 입력해야해요",
    }),
  pos: z.nativeEnum(PositionEnum),
  genre: z.nativeEnum(GenreEnum),
  level: z.nativeEnum(LevelEnum),
  location: z.nativeEnum(LocationEnum).optional(),
});
export type FormData_User = z.infer<typeof ZodSchema_User>;

const ZodSchema_HeadCnt = z.object({
  pos: z.string(),
  headcnt: z.number(),
});
const ZodSchema_Song = z.object({
  title: z.string(),
  artist: z.string(),
  album_cover_url: z.string(),
});
const ZodSchema_LocationDetail = z
  .object({
    name: z.string(),
    address: z.string(),
    category: z.string(),
  })
  .optional()
  .nullable();
export const ZodSchema_Post = z.object({
  title: z
    .string()
    .min(5, {
      message: "제목을 5글자 이상 입력해주세요.",
    })
    .max(20, {
      message: "제목은 20글자를 초과할 수 없습니다.",
    }),
  body: z.string().max(1000, {
    message: "내용은 1000글자를 초과할 수 없습니다.",
  }),
  location: z.array(z.nativeEnum(LocationEnum)).nonempty(),
  genre: z.array(z.nativeEnum(GenreEnum)).nonempty(),
  level: z.array(z.nativeEnum(LevelEnum)).nonempty(),
  headcnt_by_pos: z.array(ZodSchema_HeadCnt),
  datetime: z.string().datetime(),
  songs: z.array(ZodSchema_Song),
  images: z.array(ZodSchema_Image),
  location_detail: ZodSchema_LocationDetail,
  openchat: z.string().optional(),
});
export type ZodType_HeadCnt = z.infer<typeof ZodSchema_HeadCnt>;
export type ZodType_Song = z.infer<typeof ZodSchema_Song>;
export type ZodType_LocationDetail = z.infer<typeof ZodSchema_LocationDetail>;
export type ZodType_Post = z.infer<typeof ZodSchema_Post>;

// ========== 밴드 관리 ==========

export const ZodSchema_Band = z.object({
  name: z
    .string()
    .min(2, { message: "밴드명을 2글자 이상 입력해주세요." })
    .max(20, { message: "밴드명은 20글자를 초과할 수 없습니다." }),
  description: z
    .string()
    .max(500, { message: "소개는 500글자를 초과할 수 없습니다." })
    .optional(),
  genre: z.array(z.nativeEnum(GenreEnum)).nonempty(),
  location: z.nativeEnum(LocationEnum),
  level: z.nativeEnum(LevelEnum),
  tags: z
    .array(z.string())
    .refine((arr) => arr.every((item) => /^#[가-힣a-zA-Z]+$|^$/.test(item)), {
      message: "태그에는 올바른 문장을 입력해야해요",
    })
    .optional(),
});
export type ZodType_Band = z.infer<typeof ZodSchema_Band>;

// ========== 구인 게시판 ==========

export const ZodSchema_RecruitPost = z.object({
  title: z
    .string()
    .min(1, { message: "제목을 입력해주세요." })
    .max(30, { message: "제목은 30글자를 초과할 수 없습니다." }),
  body: z
    .string()
    .max(1000, { message: "내용은 1000글자를 초과할 수 없습니다." }),
  positions: z.array(ZodSchema_HeadCnt).nonempty(),
  genre: z.array(z.nativeEnum(GenreEnum)).nonempty(),
  level: z.array(z.nativeEnum(LevelEnum)).nonempty(),
  location: z.nativeEnum(LocationEnum),
  songs: z.array(ZodSchema_Song).optional(),
  images: z.array(ZodSchema_Image).optional(),
  video_url: z.string().url().optional().or(z.literal("")),
  openchat: z.string().url().optional().or(z.literal("")),
  deadline: z.string().datetime().optional().or(z.literal("")),
});
export type ZodType_RecruitPost = z.infer<typeof ZodSchema_RecruitPost>;

export const ZodSchema_RecruitComment = z.object({
  body: z
    .string()
    .min(1, { message: "내용을 입력해주세요." })
    .max(300, { message: "내용은 300글자를 초과할 수 없습니다." }),
  applied_pos: z.nativeEnum(PositionEnum),
});
export type ZodType_RecruitComment = z.infer<typeof ZodSchema_RecruitComment>;
