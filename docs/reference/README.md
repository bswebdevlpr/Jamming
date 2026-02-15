# Reference

> API, 데이터베이스 스키마, 타입 정의 레퍼런스

## Database Schema

### user 테이블

사용자 프로필 정보를 저장합니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | string (UUID) | PK, Supabase Auth ID |
| `nickname` | string | 닉네임 (1-8자, 영문/한글/숫자) |
| `profile_image` | string | 프로필 이미지 URL |
| `location` | LocationEnum | 활동 지역 |
| `pos` | PositionEnum | 주 포지션 |
| `genre` | GenreEnum | 선호 장르 |
| `level` | LevelEnum | 실력 수준 |
| `tags` | string[] | 태그 배열 (`#rock`, `#blues`) |
| `bpm` | number | BPM (선택) |
| `is_bpm_public` | boolean | BPM 공개 여부 |
| `allow_noti` | boolean | 알림 허용 |
| `accept_marketing` | boolean | 마케팅 수신 동의 |
| `status` | 'a' \| 'i' | 활성/비활성 |

**TypeScript Interface:**
```typescript
// app/lib/interfaces/entity.interface.ts
interface Entity_User {
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
  status?: 'a' | 'i';
  playlist: Entity_Playlist[];
}
```

### jamsession 테이블

잼 세션 정보를 저장합니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | number | PK, auto-increment |
| `user_id` | string | FK → user.id (호스트) |
| `title` | string | 제목 (5-20자) |
| `body` | string | 설명 (최대 1000자) |
| `location` | LocationEnum[] | 지역 (복수 선택) |
| `genre` | GenreEnum[] | 장르 (복수 선택) |
| `level` | LevelEnum[] | 실력대 (복수 선택) |
| `pos` | PositionEnum[] | 모집 포지션 |
| `datetime` | string | 일시 (ISO8601) |
| `location_detail` | JSON | 상세 장소 정보 |
| `headcnt_by_pos` | JSON[] | 포지션별 모집 인원 |
| `songs` | JSON[] | 합주곡 목록 |
| `images` | string[] | 이미지 URL 배열 |
| `openchat` | string | 오픈채팅 링크 (선택) |
| `created_at` | string | 생성일시 |

**JSON 필드 상세:**

```typescript
// location_detail
{
  name: string;      // 장소명
  address: string;   // 주소
  category: string;  // 카테고리
}

// headcnt_by_pos
[
  { pos: "기타", headcnt: 2 },
  { pos: "드럼", headcnt: 1 }
]

// songs
[
  { title: "곡명", artist: "아티스트", album_cover_url: "URL" }
]
```

**TypeScript Interface:**
```typescript
interface Entity_JamSession {
  id?: number;
  user_id?: string;
  title?: string;
  body?: string;
  location?: LocationEnum[];
  genre?: GenreEnum[];
  level?: LevelEnum[];
  pos?: PositionEnum[];
  datetime?: string;
  location_detail?: ZodType_LocationDetail;
  headcnt_by_pos?: ZodType_HeadCnt[];
  songs?: ZodType_Song[];
  images?: string[];
  openchat?: string;
  created_at?: string;

  // 계산 필드 (DB 컬럼 아님)
  curHeadCnt?: number;          // 현재 참가 인원
  maxHeadCnt?: number;          // 최대 인원
  appliedPosDict?: Record<string, number>;  // 포지션별 신청 수

  // Relations
  user?: Entity_User;
  jamentry?: Entity_JamEntry[];
}
```

### jamentry 테이블

잼 세션 참가 신청 정보를 저장합니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | number | PK, auto-increment |
| `jam_id` | number | FK → jamsession.id |
| `user_id` | string | FK → user.id |
| `appeal` | string | 자기소개 (HTML sanitized) |
| `applied_pos` | PositionEnum | 신청 포지션 |
| `is_allowed` | boolean | 승인 여부 |
| `is_rejam` | boolean | 재잼(재신청) 여부 |
| `noshow` | boolean | 노쇼 여부 |

**TypeScript Interface:**
```typescript
interface Entity_JamEntry {
  id: number;
  jam_id: number;
  user_id: string;
  appeal: string;
  applied_pos: PositionEnum;
  is_allowed: boolean;
  is_rejam: boolean;
  noshow?: boolean;
  user?: Entity_User;
}
```

### playlist 테이블

사용자 플레이리스트 정보를 저장합니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | number | PK |
| `user_id` | string | FK → user.id |
| `title` | string | 곡 제목 |
| `thumbnail_path` | string | 썸네일 URL |
| `author` | string | 아티스트 |
| `date` | string | 추가 날짜 |
| `is_public` | boolean | 공개 여부 |
| `origin` | string | 출처 (spotify 등) |

### user_nickname 테이블

닉네임 중복 검사용 테이블입니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `nickname` | string | PK, 닉네임 |

---

## API Endpoints

### `/api/auth/callback` (GET)

OAuth 콜백 처리

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `code` | query | OAuth 인증 코드 |

**응답:**
- 기존 사용자 → `/jamsession` 리다이렉트
- 신규 사용자 → `/signup` 리다이렉트
- 에러 → `/auth/auth-code-error` 리다이렉트

**파일:** `app/api/auth/callback/route.ts`

### `/api/maniadb` (POST)

ManiaDB 곡 검색

**요청:**
```json
{
  "songName": "검색어"
}
```

**응답:**
```json
{
  "status": 200,
  "msg": "Success",
  "data": [
    {
      "title": "곡명",
      "artist": "아티스트",
      "album_cover_url": "URL"
    }
  ]
}
```

**파일:** `app/api/maniadb/route.ts`

### `/api/naver/map` (POST)

Naver Local Search API

**요청:**
```json
{
  "query": "장소 검색어"
}
```

**응답:**
```json
{
  "status": 200,
  "msg": "Success",
  "data": [
    {
      "name": "장소명",
      "address": "주소",
      "category": "카테고리"
    }
  ]
}
```

**파일:** `app/api/naver/map/route.ts`

---

## Server Actions

### Create (`app/api/functions/create.ts`)

| 함수 | 파라미터 | 반환 | 설명 |
|------|----------|------|------|
| `createJamEntry` | `CreateJamEntryDto` | `Promise<boolean>` | 참가 신청 생성 |

### Read (`app/api/functions/read.ts`)

| 함수 | 파라미터 | 반환 | 설명 |
|------|----------|------|------|
| `getUser` | `supabase` | `Promise<User>` | 현재 사용자 조회 |
| `getJam` | `id: number` | `Promise<Entity_JamSession>` | 잼 세션 상세 조회 |

### Delete (`app/api/functions/delete.ts`)

| 함수 | 파라미터 | 반환 | 설명 |
|------|----------|------|------|
| `deleteJamSession` | `jam_id: number` | `Promise<boolean>` | 잼 세션 삭제 |
| `deleteJamEntry` | `entryId: number` | `Promise<boolean>` | 참가 신청 삭제 |

### Validation (`app/api/functions/validation.ts`)

| 함수 | 파라미터 | 반환 | 설명 |
|------|----------|------|------|
| `isNicknameUnique` | `nickname: string` | `Promise<boolean>` | 닉네임 중복 검사 |

### Fetch (`app/lib/functions/fetch.ts`)

| 함수 | 파라미터 | 반환 | 설명 |
|------|----------|------|------|
| `fetchJams` | `{ pageParam, queryFnParam }` | `Promise<{ data, nextPage }>` | 잼 세션 목록 (페이지네이션) |

### JamSession Actions (`app/(pages)/(only-user)/jamsession/functions/fetch.ts`)

| 함수 | 설명 |
|------|------|
| `createJamSession` | 잼 세션 생성 (이미지 업로드 포함) |
| `updateJamSession` | 잼 세션 수정 |
| `initialize` | 세션 상세 페이지 초기화 (권한 확인) |

### MyAct Actions (`app/(pages)/(only-user)/myact/[id]/functions/fetch.ts`)

| 함수 | 설명 |
|------|------|
| `allowEntry` | 참가 신청 승인 |
| `refuseEntry` | 참가 신청 거절 |
| `setNoShow` | 노쇼 처리 |
| `letOutMember` | 참가자 내보내기 |

---

## TypeScript Types

### Enums

**GenreEnum** (`app/lib/enums/genre.enum.ts`)
```typescript
enum GenreEnum {
  All = "종합",
  Rock = "락",
  Pop = "팝",
  Indie = "인디",
  Jazz = "재즈",
  Punk = "펑크",
  Metal = "메탈",
}
```

**PositionEnum** (`app/lib/enums/position.enum.ts`)
```typescript
enum PositionEnum {
  Guitar = "기타",
  Base = "베이스",
  Drum = "드럼",
  Vocal = "보컬",
  Keyboard = "키보드",
  ETC = "그 외",
}
```

**LevelEnum** (`app/lib/enums/level.enum.ts`)
```typescript
enum LevelEnum {
  Pro = "프로",
  Amature = "아마추어",
  Study = "스터디",
  Hobby = "취미",
}
```

**LocationEnum** (`app/lib/enums/location.enum.ts`)
```typescript
enum LocationEnum {
  Everywhere = "전체",
  SeoUl = "서울",
  GyeonGgiNorth = "경기 북부",
  GyeonGgiSouth = "경기 남부",
  InCheon = "인천",
  BuSan = "부산",
  DaeGu = "대구",
  DaeJeon = "대전",
  GwangJu = "광주",
  UlSan = "울산",
  SeJong = "세종",
  GangWon = "강원",
  ChungBuk = "충북",
  ChungNam = "충남",
  JeonBuk = "전북",
  JeonNam = "전남",
  GyeongBuk = "경북",
  GyeongNam = "경남",
  JeJu = "제주",
}
```

**UserStatus** (`app/lib/enums/user.enum.ts`)
```typescript
enum UserStatus {
  Active = "a",
  Inactive = "i",
}
```

### DTOs (`app/api/dtos/create.ts`)

```typescript
interface CreateJamDto {
  user_id: string;
  title: string;
  body: string;
  location: LocationEnum[];
  pos: PositionEnum[];
  genre: GenreEnum[];
  level: LevelEnum[];
  date: string;
  headcnt_by_pos: number;
}

interface CreateJamEntryDto {
  user_id: number | string;
  jam_id: number | string;
  appeal: string;
  applied_pos: string;
}

interface CreatePlaylistItemDto {
  user_id: string;
  thumbnail_path: string;
  title: string;
  author: string;
  date: string;
  origin: string;
}
```

### API Response (`app/api/types/response.interface.ts`)

```typescript
interface FetchResult {
  status: number;   // 200: 성공, 500: 실패
  msg: string;      // 상태 메시지
  data: any;        // 응답 데이터
}
```

### Global Context (`app/lib/interfaces/global.interface.ts`)

```typescript
interface GlobalContext {
  bodyWidth: number;
  bodyHeight: number;
  isSmallLoadingOn: boolean;
  setSmallLoading: () => void;
  bottomSheet: BottomSheetContext;
  session: {
    userProfile: UserProfile;
    setUserProfile: (input: Partial<UserProfile>) => void;
  };
  resetSlideCalendarDots: boolean;
  setResetSlideCalendarDots: Dispatch<SetStateAction<boolean>>;
}

interface BottomSheetContext {
  children: ReactNode;
  location: BottomSheetHeight;
  set: (input: Partial<BottomSheetContext>) => void;
  header?: boolean;
  setHeader: null | ((input: boolean) => void);
}

interface UserProfile {
  isLoaded: undefined | boolean;
  accept_marketing: undefined | boolean;
  profile_image: undefined | null | string;
  nickname: undefined | string;
  tags: undefined | string[];
  pos: undefined | PositionEnum;
  genre: undefined | GenreEnum;
  level: undefined | LevelEnum;
  location: undefined | LocationEnum;
}
```

---

## Enum-String 매핑 (`app/lib/maps/jam.ts`)

데이터베이스에 축약형으로 저장하기 위한 매핑입니다.

```typescript
// Position
const MapDataToPosition = {
  g: PositionEnum.Guitar,
  b: PositionEnum.Base,
  d: PositionEnum.Drum,
  v: PositionEnum.Vocal,
  k: PositionEnum.Keyboard,
  e: PositionEnum.ETC,
};
const MapPositionToData = _.invert(MapDataToPosition);

// Genre
const MapDataToGenre = {
  a: GenreEnum.All,
  r: GenreEnum.Rock,
  po: GenreEnum.Pop,
  i: GenreEnum.Indie,
  j: GenreEnum.Jazz,
  pu: GenreEnum.Punk,
  m: GenreEnum.Metal,
};
const MapGenreToData = _.invert(MapDataToGenre);

// Level
const MapDataToLevel = {
  p: LevelEnum.Pro,
  a: LevelEnum.Amature,
  s: LevelEnum.Study,
  h: LevelEnum.Hobby,
};
const MapLevelToData = _.invert(MapDataToLevel);

// Location
const MapDataToLocation = {
  e: LocationEnum.Everywhere,
  su: LocationEnum.SeoUl,
  gn: LocationEnum.GyeonGgiNorth,
  gs: LocationEnum.GyeonGgiSouth,
  // ... (19개 지역)
};
const MapLocationToData = _.invert(MapDataToLocation);
```

---

## Zod Validation (`app/lib/zod.ts`)

### User Schema

```typescript
const ZodSchema_User = z.object({
  accept_marketing: z.boolean(),
  nickname: z
    .string()
    .min(1, { message: "닉네임을 입력해주세요" })
    .max(8, { message: "닉네임을 입력해주세요" })
    .regex(/^[a-zA-Z가-힣0-9]+$/, "올바른 닉네임을 입력해주세요"),
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
```

### Post Schema

```typescript
const ZodSchema_Post = z.object({
  title: z
    .string()
    .min(5, { message: "제목을 5글자 이상 입력해주세요." })
    .max(20, { message: "제목은 20글자를 초과할 수 없습니다." }),
  body: z.string().max(1000, { message: "내용은 1000글자를 초과할 수 없습니다." }),
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
```

### Sub Schemas

```typescript
const ZodSchema_HeadCnt = z.object({
  pos: z.nativeEnum(PositionEnum),
  headcnt: z.number().min(1),
});

const ZodSchema_Song = z.object({
  title: z.string(),
  artist: z.string(),
  album_cover_url: z.string().optional(),
});

const ZodSchema_LocationDetail = z.object({
  name: z.string(),
  address: z.string(),
  category: z.string().optional(),
});

const ZodSchema_Image = z.object({
  url: z.string(),
  file: z.any().optional(),
});
```

---

## Testing Commands

### Vitest (단위/통합 테스트)

```bash
# Watch 모드 (개발 중)
pnpm test

# 전체 테스트 실행 (CI 모드)
pnpm test:run

# 커버리지 리포트 생성
pnpm test:coverage

# UI 모드 (브라우저에서 테스트 확인)
pnpm test:ui
```

### Playwright (E2E 테스트)

```bash
# E2E 테스트 실행
pnpm test:e2e

# UI 모드 (디버깅)
pnpm test:e2e:ui

# 특정 브라우저만 실행
pnpm test:e2e --project=chromium
```

### 테스트 구조

```
__tests__/
├── unit/           # 단위 테스트 (185 케이스)
│                   # - lib/ (순수 함수, 유틸)
│                   # - stores/ (Zustand stores)
│                   # - hooks/ (Custom hooks)
├── integration/    # 통합 테스트 (117 케이스)
│                   # - auth/ (인증 시스템)
│                   # - api/ (Server Actions)
│                   # - external/ (외부 API)
├── component/      # 컴포넌트 테스트 (35 케이스)
│                   # - React Testing Library
└── e2e/            # E2E 테스트 (31 케이스)
                    # - Playwright
```

### CI/CD

GitHub Actions에서 자동 실행:
- PR/push 시 단위/통합 테스트 실행
- `master` push 시 E2E 테스트 실행

**파일:** `.github/workflows/test.yml`

---

## 관련 문서

- [Context](../context/README.md) - 프로젝트 컨텍스트
- [Architecture](../architecture/README.md) - 시스템 구조
- [Patterns](../patterns/README.md) - 코드 패턴
