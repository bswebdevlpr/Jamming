import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";

/**
 * Test band factory
 */
export function createTestBand(overrides: Record<string, any> = {}) {
  return {
    id: "band-001",
    leader_id: "test-user-id-001",
    name: "테스트 밴드",
    description: "테스트용 밴드입니다",
    genre: [GenreEnum.Rock],
    location: LocationEnum.SeoUl,
    level: LevelEnum.Amature,
    profile_image: null,
    tags: ["#락밴드"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    band_member: [],
    memberCount: 0,
    ...overrides,
  };
}

/**
 * Test band member factory
 */
export function createTestBandMember(overrides: Record<string, any> = {}) {
  return {
    id: "member-001",
    band_id: "band-001",
    user_id: "test-user-id-001",
    pos: PositionEnum.Guitar,
    role: "leader" as const,
    is_public: true,
    joined_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      nickname: "테스트유저",
      profile_image: null,
      pos: "g",
      genre: "r",
      level: "a",
      bpm: 120,
    },
    ...overrides,
  };
}

/**
 * CreateBandDto factory
 */
export function createBandInput(overrides: Record<string, any> = {}) {
  return {
    leader_id: "test-user-id-001",
    name: "새 밴드",
    description: "설명입니다",
    genre: [GenreEnum.Rock] as GenreEnum[],
    location: LocationEnum.SeoUl,
    level: LevelEnum.Amature,
    tags: ["#락"],
    ...overrides,
  };
}

/**
 * CreateBandMemberDto factory
 */
export function createBandMemberInput(overrides: Record<string, any> = {}) {
  return {
    band_id: "band-001",
    user_id: "test-user-id-002",
    pos: PositionEnum.Vocal,
    role: "member" as const,
    is_public: true,
    ...overrides,
  };
}
