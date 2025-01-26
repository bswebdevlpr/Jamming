import { z } from "zod";
import { PositionEnum } from "./constants/position.enum";
import { GenreEnum } from "./constants/genre.enum";
import { LevelEnum } from "./constants/level.enum";
import { ImageFile } from "./interfaces/zod.interface";
import { LocationEnum } from "./constants/location.enum";

export const FormSchema_User = z.object({
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
  location: z.enum(Object.keys(LocationEnum) as [string, ...string[]]),
});

export type FormData_User = z.infer<typeof FormSchema_User>;
