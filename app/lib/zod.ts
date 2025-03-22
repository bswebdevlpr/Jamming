import { z } from "zod";
import { PositionEnum } from "./enums/position.enum";
import { GenreEnum } from "./enums/genre.enum";
import { LevelEnum } from "./enums/level.enum";
import { LocationEnum } from "./enums/location.enum";
import { ImageFile } from "./interfaces/dto.interface";

export const FormSchema_User = z.object({
  acceptMarketing: z.boolean(),
  profileImage: z.custom<ImageFile>().nullable(),
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
export type FormData_User = z.infer<typeof FormSchema_User>;

export const FormSchema_Post = z.object({
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
  pos: z.array(z.enum(Object.keys(PositionEnum) as [string, ...string[]])),
  genre: z.array(z.enum(Object.keys(GenreEnum) as [string, ...string[]])),
  level: z.array(z.enum(Object.keys(LevelEnum) as [string, ...string[]])),
  max_head_cnt: z.number().max(100, {
    message: "최대 인원수는 100명을 초과할 수 없습니다.",
  }),
  date: z.string().date(),
});
export type FormData_Post = z.infer<typeof FormSchema_Post>;
