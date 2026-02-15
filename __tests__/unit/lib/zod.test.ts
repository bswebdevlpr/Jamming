import { describe, it, expect } from "vitest";
import {
  ZodSchema_User,
  ZodSchema_Post,
  ZodSchema_Band,
  ZodSchema_RecruitPost,
  ZodSchema_RecruitComment,
} from "@/app/lib/zod";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";

describe("ZodSchema_User", () => {
  const validUser = {
    accept_marketing: false,
    nickname: "테스트유저",
    tags: ["#락", "#기타"],
    pos: PositionEnum.Guitar,
    genre: GenreEnum.Rock,
    level: LevelEnum.Amature,
  };

  it("should validate a valid user", () => {
    const result = ZodSchema_User.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("should reject empty nickname", () => {
    const result = ZodSchema_User.safeParse({ ...validUser, nickname: "" });
    expect(result.success).toBe(false);
  });

  it("should reject nickname longer than 8 chars", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      nickname: "아홉글자넘는닉네임이름",
    });
    expect(result.success).toBe(false);
  });

  it("should reject nickname with special chars", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      nickname: "test@user",
    });
    expect(result.success).toBe(false);
  });

  it("should allow alphanumeric and Korean nickname", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      nickname: "테스트123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid tags (no # prefix)", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      tags: ["락"],
    });
    expect(result.success).toBe(false);
  });

  it("should accept valid tags", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      tags: ["#락밴드", "#기타리스트"],
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty tags array", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      tags: [],
    });
    expect(result.success).toBe(true);
  });

  it("should allow location as optional", () => {
    const result = ZodSchema_User.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("should accept valid location", () => {
    const result = ZodSchema_User.safeParse({
      ...validUser,
      location: LocationEnum.SeoUl,
    });
    expect(result.success).toBe(true);
  });
});

describe("ZodSchema_Post", () => {
  const validPost = {
    title: "잼 세션 합니다",
    body: "같이 합주해요",
    location: [LocationEnum.SeoUl],
    genre: [GenreEnum.Rock],
    level: [LevelEnum.Amature],
    headcnt_by_pos: [{ pos: "기타", headcnt: 2 }],
    datetime: new Date().toISOString(),
    songs: [],
    images: [],
    location_detail: null,
  };

  it("should validate a valid post", () => {
    const result = ZodSchema_Post.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it("should reject title shorter than 5 chars", () => {
    const result = ZodSchema_Post.safeParse({
      ...validPost,
      title: "짧은",
    });
    expect(result.success).toBe(false);
  });

  it("should reject title longer than 20 chars", () => {
    const result = ZodSchema_Post.safeParse({
      ...validPost,
      title: "이건 진짜 엄청 긴 제목이라서 20글자를 초과합니다 확실해요",
    });
    expect(result.success).toBe(false);
  });

  it("should reject body longer than 1000 chars", () => {
    const result = ZodSchema_Post.safeParse({
      ...validPost,
      body: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("should require at least one location", () => {
    const result = ZodSchema_Post.safeParse({
      ...validPost,
      location: [],
    });
    expect(result.success).toBe(false);
  });

  it("should require at least one genre", () => {
    const result = ZodSchema_Post.safeParse({
      ...validPost,
      genre: [],
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional openchat", () => {
    const result = ZodSchema_Post.safeParse({
      ...validPost,
      openchat: "https://open.kakao.com/test",
    });
    expect(result.success).toBe(true);
  });
});

describe("ZodSchema_Band", () => {
  const validBand = {
    name: "테스트밴드",
    genre: [GenreEnum.Rock],
    location: LocationEnum.SeoUl,
    level: LevelEnum.Amature,
  };

  it("should validate a valid band", () => {
    const result = ZodSchema_Band.safeParse(validBand);
    expect(result.success).toBe(true);
  });

  it("should reject name shorter than 2 chars", () => {
    const result = ZodSchema_Band.safeParse({ ...validBand, name: "밴" });
    expect(result.success).toBe(false);
  });

  it("should reject name longer than 20 chars", () => {
    const result = ZodSchema_Band.safeParse({
      ...validBand,
      name: "이름이엄청길어서20글자를초과하는밴드이름입니다",
    });
    expect(result.success).toBe(false);
  });

  it("should reject description longer than 500 chars", () => {
    const result = ZodSchema_Band.safeParse({
      ...validBand,
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("should require at least one genre", () => {
    const result = ZodSchema_Band.safeParse({
      ...validBand,
      genre: [],
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional description", () => {
    const result = ZodSchema_Band.safeParse(validBand);
    expect(result.success).toBe(true);
  });

  it("should accept valid tags", () => {
    const result = ZodSchema_Band.safeParse({
      ...validBand,
      tags: ["#락밴드"],
    });
    expect(result.success).toBe(true);
  });
});

describe("ZodSchema_RecruitPost", () => {
  const validRecruit = {
    title: "기타리스트 구합니다",
    body: "락 밴드에서 기타리스트 구합니다",
    positions: [{ pos: "기타", headcnt: 1 }],
    genre: [GenreEnum.Rock],
    level: [LevelEnum.Amature],
    location: LocationEnum.SeoUl,
  };

  it("should validate a valid recruit post", () => {
    const result = ZodSchema_RecruitPost.safeParse(validRecruit);
    expect(result.success).toBe(true);
  });

  it("should reject empty title", () => {
    const result = ZodSchema_RecruitPost.safeParse({
      ...validRecruit,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject title longer than 30 chars", () => {
    const result = ZodSchema_RecruitPost.safeParse({
      ...validRecruit,
      title: "아".repeat(31),
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional video_url", () => {
    const result = ZodSchema_RecruitPost.safeParse({
      ...validRecruit,
      video_url: "https://youtube.com/watch?v=test",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty string for video_url", () => {
    const result = ZodSchema_RecruitPost.safeParse({
      ...validRecruit,
      video_url: "",
    });
    expect(result.success).toBe(true);
  });

  it("should accept optional deadline", () => {
    const result = ZodSchema_RecruitPost.safeParse({
      ...validRecruit,
      deadline: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("should require at least one position", () => {
    const result = ZodSchema_RecruitPost.safeParse({
      ...validRecruit,
      positions: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("ZodSchema_RecruitComment", () => {
  it("should validate a valid comment", () => {
    const result = ZodSchema_RecruitComment.safeParse({
      body: "지원합니다!",
      applied_pos: PositionEnum.Guitar,
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty body", () => {
    const result = ZodSchema_RecruitComment.safeParse({
      body: "",
      applied_pos: PositionEnum.Guitar,
    });
    expect(result.success).toBe(false);
  });

  it("should reject body longer than 300 chars", () => {
    const result = ZodSchema_RecruitComment.safeParse({
      body: "a".repeat(301),
      applied_pos: PositionEnum.Guitar,
    });
    expect(result.success).toBe(false);
  });
});
