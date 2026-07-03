# Reference

> API, database schema, and type definition reference

## Database Schema

### `user` table

Stores user profile information.

| Column | Type | Description |
|------|------|------|
| `id` | string (UUID) | PK, Supabase Auth ID |
| `nickname` | string | Nickname (1-8 characters, alphanumeric/Korean) |
| `profile_image` | string | Profile image URL |
| `location` | LocationEnum | Activity region |
| `pos` | PositionEnum | Primary position |
| `genre` | GenreEnum | Preferred genre |
| `level` | LevelEnum | Skill level |
| `tags` | string[] | Tag array (`#rock`, `#blues`) |
| `bpm` | number | BPM (optional) |
| `is_bpm_public` | boolean | Whether BPM is public |
| `allow_noti` | boolean | Notifications allowed |
| `accept_marketing` | boolean | Consent to marketing communications |
| `status` | 'a' \| 'i' | Active/inactive |

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

### `jamsession` table

Stores jam session information.

| Column | Type | Description |
|------|------|------|
| `id` | number | PK, auto-increment |
| `user_id` | string | FK → user.id (host) |
| `title` | string | Title (5-20 characters) |
| `body` | string | Description (max 1000 characters) |
| `location` | LocationEnum[] | Region (multiple selection) |
| `genre` | GenreEnum[] | Genre (multiple selection) |
| `level` | LevelEnum[] | Skill level (multiple selection) |
| `pos` | PositionEnum[] | Positions being recruited |
| `datetime` | string | Date and time (ISO8601) |
| `location_detail` | JSON | Detailed venue information |
| `headcnt_by_pos` | JSON[] | Number of members recruited per position |
| `songs` | JSON[] | Ensemble song list |
| `images` | string[] | Image URL array |
| `openchat` | string | Open chat link (optional) |
| `created_at` | string | Creation date and time |

**JSON field details:**

```typescript
// location_detail
{
  name: string;      // Venue name
  address: string;   // Address
  category: string;  // Category
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

  // Computed fields (not DB columns)
  curHeadCnt?: number;          // Current number of participants
  maxHeadCnt?: number;          // Maximum number of members
  appliedPosDict?: Record<string, number>;  // Application count per position

  // Relations
  user?: Entity_User;
  jamentry?: Entity_JamEntry[];
}
```

### `jamentry` table

Stores jam session application information.

| Column | Type | Description |
|------|------|------|
| `id` | number | PK, auto-increment |
| `jam_id` | number | FK → jamsession.id |
| `user_id` | string | FK → user.id |
| `appeal` | string | Self-introduction (HTML sanitized) |
| `applied_pos` | PositionEnum | Applied position |
| `is_allowed` | boolean | Whether approved |
| `is_rejam` | boolean | Whether re-jam (re-application) |
| `noshow` | boolean | Whether no-show |

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

### `playlist` table

Stores user playlist information.

| Column | Type | Description |
|------|------|------|
| `id` | number | PK |
| `user_id` | string | FK → user.id |
| `title` | string | Song title |
| `thumbnail_path` | string | Thumbnail URL |
| `author` | string | Artist |
| `date` | string | Date added |
| `is_public` | boolean | Whether public |
| `origin` | string | Source (spotify, etc.) |

### `user_nickname` table

Table used for nickname uniqueness checks.

| Column | Type | Description |
|------|------|------|
| `nickname` | string | PK, nickname |

---

## API Endpoints

### `/api/auth/callback` (GET)

Handles the OAuth callback

| Parameter | Type | Description |
|----------|------|------|
| `code` | query | OAuth authorization code |

**Response:**
- Existing user → redirect to `/jamsession`
- New user → redirect to `/signup`
- Error → redirect to `/auth/auth-code-error`

**File:** `app/api/auth/callback/route.ts`

### `/api/maniadb` (POST)

ManiaDB song search

**Request:**
```json
{
  "songName": "검색어"
}
```

**Response:**
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

**File:** `app/api/maniadb/route.ts`

### `/api/naver/map` (POST)

Naver Local Search API

**Request:**
```json
{
  "query": "장소 검색어"
}
```

**Response:**
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

**File:** `app/api/naver/map/route.ts`

---

## Server Actions

### Create (`app/api/functions/create.ts`)

| Function | Parameters | Returns | Description |
|------|----------|------|------|
| `createJamEntry` | `CreateJamEntryDto` | `Promise<boolean>` | Create an application |

### Read (`app/api/functions/read.ts`)

| Function | Parameters | Returns | Description |
|------|----------|------|------|
| `getUser` | `supabase` | `Promise<User>` | Retrieve the current user |
| `getJam` | `id: number` | `Promise<Entity_JamSession>` | Retrieve jam session details |

### Delete (`app/api/functions/delete.ts`)

| Function | Parameters | Returns | Description |
|------|----------|------|------|
| `deleteJamSession` | `jam_id: number` | `Promise<boolean>` | Delete a jam session |
| `deleteJamEntry` | `entryId: number` | `Promise<boolean>` | Delete an application |

### Validation (`app/api/functions/validation.ts`)

| Function | Parameters | Returns | Description |
|------|----------|------|------|
| `isNicknameUnique` | `nickname: string` | `Promise<boolean>` | Check nickname uniqueness |

### Fetch (`app/lib/functions/fetch.ts`)

| Function | Parameters | Returns | Description |
|------|----------|------|------|
| `fetchJams` | `{ pageParam, queryFnParam }` | `Promise<{ data, nextPage }>` | Jam session list (pagination) |

### JamSession Actions (`app/(pages)/(only-user)/jamsession/functions/fetch.ts`)

| Function | Description |
|------|------|
| `createJamSession` | Create a jam session (including image upload) |
| `updateJamSession` | Update a jam session |
| `initialize` | Initialize the session detail page (permission check) |

### MyAct Actions (`app/(pages)/(only-user)/myact/[id]/functions/fetch.ts`)

| Function | Description |
|------|------|
| `allowEntry` | Approve an application |
| `refuseEntry` | Reject an application |
| `setNoShow` | Mark as no-show |
| `letOutMember` | Remove a participant |

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
  status: number;   // 200: success, 500: failure
  msg: string;      // Status message
  data: any;        // Response data
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

## Enum-String Mapping (`app/lib/maps/jam.ts`)

Mapping used to store values in abbreviated form in the database.

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
  // ... (19 regions)
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

### Vitest (unit/integration tests)

```bash
# Watch mode (during development)
pnpm test

# Run all tests (CI mode)
pnpm test:run

# Generate coverage report
pnpm test:coverage

# UI mode (view tests in the browser)
pnpm test:ui
```

### Playwright (E2E tests)

```bash
# Run E2E tests
pnpm test:e2e

# UI mode (debugging)
pnpm test:e2e:ui

# Run a specific browser only
pnpm test:e2e --project=chromium
```

### Test Structure

```
__tests__/
├── unit/           # Unit tests (185 cases)
│                   # - lib/ (pure functions, utils)
│                   # - stores/ (Zustand stores)
│                   # - hooks/ (Custom hooks)
├── integration/    # Integration tests (117 cases)
│                   # - auth/ (authentication system)
│                   # - api/ (Server Actions)
│                   # - external/ (external APIs)
├── component/      # Component tests (35 cases)
│                   # - React Testing Library
└── e2e/            # E2E tests (31 cases)
                    # - Playwright
```

### CI/CD

Runs automatically via GitHub Actions:
- Unit/integration tests run on PR/push
- E2E tests run on `master` push

**File:** `.github/workflows/test.yml`

---

## Related Documents

- [Context](../context/README.md) - Project context
- [Architecture](../architecture/README.md) - System structure
- [Patterns](../patterns/README.md) - Code patterns
