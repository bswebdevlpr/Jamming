import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";

/**
 * Test jam session factory
 */
export function createTestJamSession(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    user_id: "test-user-id-001",
    title: "주말 잼 세션",
    body: "같이 합주해요!",
    location: [LocationEnum.SeoUl],
    genre: [GenreEnum.Rock],
    level: [LevelEnum.Amature],
    datetime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    headcnt_by_pos: [
      { pos: "기타", headcnt: 2 },
      { pos: "드럼", headcnt: 1 },
    ],
    songs: [
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album_cover_url: "https://example.com/cover.jpg",
      },
    ],
    images: [],
    location_detail: {
      name: "홍대 연습실",
      address: "서울시 마포구",
      category: "음악연습실",
    },
    openchat: "https://open.kakao.com/test",
    created_at: new Date().toISOString(),
    user: {
      nickname: "테스트유저",
      pos: "g",
      genre: "r",
      level: "a",
      bpm: 120,
      profile_image: null,
    },
    jamentry: [],
    ...overrides,
  };
}

/**
 * Jam entry factory
 */
export function createTestJamEntry(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    jam_id: 1,
    user_id: "test-user-id-002",
    appeal: "잘 부탁드립니다",
    applied_pos: "기타",
    is_allowed: false,
    is_rejam: false,
    ...overrides,
  };
}

/**
 * Processed jam session (with computed fields)
 */
export function createProcessedJamSession(overrides: Record<string, any> = {}) {
  const session = createTestJamSession(overrides);
  return {
    ...session,
    curHeadCnt: session.jamentry?.length ?? 0,
    maxHeadCnt: session.headcnt_by_pos.reduce(
      (acc: number, cur: any) => acc + cur.headcnt,
      0
    ),
    appliedPosDict: {},
  };
}
