import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";

/**
 * Test user factory
 */
export function createTestUser(overrides: Record<string, any> = {}) {
  return {
    id: "test-user-id-001",
    email: "test@example.com",
    nickname: "테스트유저",
    profile_image: null,
    pos: PositionEnum.Guitar,
    genre: GenreEnum.Rock,
    level: LevelEnum.Amature,
    location: LocationEnum.SeoUl,
    tags: ["#락", "#기타"],
    bpm: 120,
    is_bpm_public: true,
    allow_noti: true,
    accept_marketing: false,
    playlist: [],
    ...overrides,
  };
}

/**
 * Auth user (Supabase auth format)
 */
export function createAuthUser(overrides: Record<string, any> = {}) {
  return {
    id: "test-user-id-001",
    email: "test@example.com",
    aud: "authenticated",
    role: "authenticated",
    ...overrides,
  };
}

/**
 * Secondary test user for multi-user scenarios
 */
export function createSecondaryUser(overrides: Record<string, any> = {}) {
  return {
    id: "test-user-id-002",
    email: "other@example.com",
    nickname: "다른유저",
    profile_image: null,
    pos: PositionEnum.Vocal,
    genre: GenreEnum.Jazz,
    level: LevelEnum.Pro,
    location: LocationEnum.BuSan,
    tags: ["#재즈", "#보컬"],
    bpm: 90,
    is_bpm_public: false,
    allow_noti: true,
    accept_marketing: true,
    playlist: [],
    ...overrides,
  };
}
