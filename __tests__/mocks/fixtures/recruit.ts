import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";

/**
 * Test recruit post factory
 */
export function createTestRecruitPost(overrides: Record<string, any> = {}) {
  return {
    id: "recruit-001",
    band_id: "band-001",
    user_id: "test-user-id-001",
    title: "기타리스트 구합니다",
    body: "락 밴드에서 기타리스트를 구합니다",
    positions: [
      { pos: "기타", headcnt: 1 },
      { pos: "드럼", headcnt: 1 },
    ],
    genre: [GenreEnum.Rock],
    level: [LevelEnum.Amature],
    location: LocationEnum.SeoUl,
    songs: [],
    images: [],
    video_url: null,
    openchat: null,
    view_count: 0,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    band: null,
    user: null,
    recruit_comment: [],
    commentCount: 0,
    appliedPosDict: {},
    ...overrides,
  };
}

/**
 * Test recruit comment factory
 */
export function createTestRecruitComment(overrides: Record<string, any> = {}) {
  return {
    id: "comment-001",
    recruit_id: "recruit-001",
    user_id: "test-user-id-002",
    body: "지원합니다!",
    applied_pos: PositionEnum.Guitar,
    is_accepted: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      nickname: "다른유저",
      profile_image: null,
      pos: "v",
      genre: "j",
      level: "p",
      bpm: 90,
    },
    ...overrides,
  };
}

/**
 * CreateRecruitPostDto factory
 */
export function createRecruitPostInput(overrides: Record<string, any> = {}) {
  return {
    band_id: "band-001",
    user_id: "test-user-id-001",
    title: "기타리스트 구합니다",
    body: "락 밴드에서 기타리스트를 구합니다",
    positions: [{ pos: "기타", headcnt: 1 }],
    genre: [GenreEnum.Rock] as GenreEnum[],
    level: [LevelEnum.Amature] as LevelEnum[],
    location: LocationEnum.SeoUl,
    songs: [],
    images: [],
    video_url: "",
    openchat: "",
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    ...overrides,
  };
}

/**
 * CreateRecruitCommentDto factory
 */
export function createRecruitCommentInput(
  overrides: Record<string, any> = {}
) {
  return {
    recruit_id: "recruit-001",
    user_id: "test-user-id-002",
    body: "지원합니다!",
    applied_pos: PositionEnum.Guitar,
    ...overrides,
  };
}
