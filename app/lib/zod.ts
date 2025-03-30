import { z, ZodSchema } from "zod";
import { PositionEnum } from "./enums/position.enum";
import { GenreEnum } from "./enums/genre.enum";
import { LevelEnum } from "./enums/level.enum";
import { LocationEnum } from "./enums/location.enum";

const ZodSchema_Image = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
});
export type ZodType_Image = z.infer<typeof ZodSchema_Image>;

export const ZodSchema_User = z.object({
  accept_marketing: z.boolean(),
  profileImage: z.custom<ZodType_Image>().nullable(),
  nickname: z
    .string()
    .min(1, { message: "닉네임을 입력해주세요" })
    .max(8, { message: "닉네임을 입력해주세요" })
    .regex(
      /^[a-zA-Z가-힣0-9]+$/, // 알파벳, 숫자, 공백만 허용
      "올바른 닉네임을 입력해주세요"
    ),
  tags: z
    .array(z.string())
    .refine((arr) => arr.every((item) => /^#[가-힣a-zA-Z]+$|^$/.test(item)), {
      message: "올바른 태그를 입력해주세요",
    }),
  position: z.enum(Object.keys(PositionEnum) as [string, ...string[]]),
  genre: z.enum(Object.keys(GenreEnum) as [string, ...string[]]),
  level: z.enum(Object.keys(LevelEnum) as [string, ...string[]]),
  location: z
    .enum(Object.keys(LocationEnum) as [string, ...string[]])
    .optional(),
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
