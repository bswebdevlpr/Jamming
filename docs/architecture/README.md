# Architecture

> 시스템 구조, 데이터 흐름, 라우팅을 이해하기 위한 문서

## 시스템 구조 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ React Query │  │   Context   │  │ React Components    │  │
│  │ (서버 상태) │  │ (UI 상태)   │  │ (페이지, UI)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Server    │  │    API      │  │    Middleware       │  │
│  │   Actions   │  │   Routes    │  │    (Auth Check)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │  PostgreSQL │  │      Storage        │  │
│  │  (Kakao)    │  │   (Tables)  │  │     (Images)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      External APIs                           │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │      ManiaDB        │  │        Naver Map            │   │
│  │    (곡 검색)        │  │       (장소 검색)           │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 디렉토리 구조

```
app/
├── layout.tsx                    # Root 레이아웃 (메타데이터, Analytics)
├── (pages)/
│   ├── layout.tsx                # GlobalLayout (Context, React Query Provider)
│   ├── context.tsx               # GlobalContext 정의
│   ├── (only-user)/              # 인증 필수 라우트 그룹
│   │   ├── layout.tsx            # 인증 검증 레이아웃
│   │   ├── jamsession/           # 잼 세션 관련
│   │   │   ├── page.tsx          # 피드 페이지
│   │   │   ├── functions/        # Server Actions
│   │   │   └── post/[id]/        # 상세 페이지
│   │   ├── myact/                # 내 활동
│   │   ├── mypage/               # 마이페이지
│   │   └── user-profile/[nickname]/
│   └── (signin)/                 # 비인증 라우트 그룹
│       ├── layout.tsx            # 로그인 상태 체크
│       └── signup/               # 회원가입
├── api/
│   ├── auth/callback/route.ts    # OAuth 콜백
│   ├── functions/                # Server Actions (create, read, delete)
│   ├── dtos/                     # Data Transfer Objects
│   ├── maniadb/route.ts          # ManiaDB 프록시
│   └── naver/map/route.ts        # Naver Map 프록시
├── lib/
│   ├── interfaces/               # TypeScript 인터페이스
│   ├── enums/                    # Enum 정의
│   ├── errors/                   # 에러 클래스
│   ├── functions/                # 유틸리티 함수
│   ├── maps/                     # Enum-String 매핑
│   └── zod.ts                    # Zod 스키마
├── ui/                           # UI 컴포넌트
│   ├── templates/                # 재사용 템플릿 (feed, popup)
│   ├── buttons/                  # 버튼 컴포넌트
│   ├── layouts/                  # 레이아웃 컴포넌트
│   └── ...
├── util/supabase/                # Supabase 클라이언트
│   ├── client.ts                 # 브라우저용
│   ├── server.ts                 # 서버용
│   └── auth.ts                   # 인증 함수
└── hooks/                        # Custom Hooks
```

## 인증 플로우 (카카오 OAuth → Supabase)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  사용자  │────▶│  /signin │────▶│  Kakao   │────▶│ Callback │
│          │     │  페이지  │     │  OAuth   │     │  /api/   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
                                                 ┌──────────────┐
                                                 │ Supabase     │
                                                 │ Session 생성 │
                                                 └──────────────┘
                                                        │
                                         ┌──────────────┴──────────────┐
                                         ▼                             ▼
                                  ┌──────────────┐              ┌──────────────┐
                                  │ user 테이블  │              │ user 테이블  │
                                  │ 데이터 있음  │              │ 데이터 없음  │
                                  └──────────────┘              └──────────────┘
                                         │                             │
                                         ▼                             ▼
                                  ┌──────────────┐              ┌──────────────┐
                                  │ /jamsession  │              │   /signup    │
                                  │  (메인)      │              │  (회원가입)  │
                                  └──────────────┘              └──────────────┘
```

**관련 파일:**
- `app/util/supabase/auth.ts:signInWithKakao()` - OAuth 시작
- `app/api/auth/callback/route.ts` - 콜백 처리
- `app/(pages)/(only-user)/layout.tsx` - 인증 검증

## 데이터 흐름 (Client → Server → Supabase)

### 읽기 (Read)

```
컴포넌트                Server Action              Supabase
   │                        │                         │
   │  useInfiniteQuery()    │                         │
   ├───────────────────────▶│                         │
   │                        │  supabase.from().select │
   │                        ├────────────────────────▶│
   │                        │                         │
   │                        │◀────────────────────────┤
   │                        │        data             │
   │◀───────────────────────┤                         │
   │    Entity[]            │                         │
```

**예시 (잼 세션 목록):**
```typescript
// app/ui/templates/feed.tsx
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["data", filter],
  queryFn: ({ pageParam }) => fetchJams({ pageParam, queryFnParam: filter }),
  staleTime: 1000 * 60 * 5,  // 5분 캐싱
});

// app/lib/functions/fetch.ts
export const fetchJams = async ({ pageParam, queryFnParam }) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jamsession")
    .select(`*, user(*), jamentry(*)`)
    .range(pageParam * 6, pageParam * 6 + 5);
  return { data, nextPage: data.length === 6 ? pageParam + 1 : null };
};
```

### 쓰기 (Create)

```
컴포넌트                Server Action              Supabase
   │                        │                         │
   │  form.handleSubmit()   │                         │
   ├───────────────────────▶│                         │
   │                        │  sanitize(input)        │
   │                        │  supabase.from().insert │
   │                        ├────────────────────────▶│
   │                        │                         │
   │                        │◀────────────────────────┤
   │◀───────────────────────┤       success/error     │
   │     boolean            │                         │
```

**예시 (참가 신청):**
```typescript
// 컴포넌트에서 호출
const result = await createJamEntry({
  jam_id,
  user_id,
  appeal: formData.appeal,
  applied_pos: selectedPosition,
});

// app/api/functions/create.ts
export async function createJamEntry(input: CreateJamEntryDto): Promise<boolean> {
  input.appeal = await sanitize(input.appeal);  // XSS 방지
  const supabase = await createClient();
  const { error } = await supabase.from("jamentry").insert(input);
  return !error;
}
```

## 상태 관리 (React Context + React Query)

### Global Context (UI 상태)

```typescript
// app/lib/interfaces/global.interface.ts
interface GlobalContext {
  // 뷰포트
  bodyWidth: number;
  bodyHeight: number;

  // 로딩
  isSmallLoadingOn: boolean;
  setSmallLoading: () => void;

  // Bottom Sheet
  bottomSheet: BottomSheetContext;

  // 세션 (사용자 프로필)
  session: {
    userProfile: UserProfile;
    setUserProfile: (input: Partial<UserProfile>) => void;
  };

  // 캘린더
  resetSlideCalendarDots: boolean;
  setResetSlideCalendarDots: Dispatch<SetStateAction<boolean>>;
}
```

**사용:**
```typescript
const { bottomSheet, session } = useContext(globalContext);

// Bottom Sheet 열기
bottomSheet.set({
  children: <MyComponent />,
  location: BottomSheetHeight.Full,
});

// 사용자 프로필 업데이트
session.setUserProfile({ nickname: "새 닉네임" });
```

### React Query (서버 상태)

```typescript
// 무한 스크롤 피드
const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
  queryKey: ["jamsessions", filter],
  queryFn: ({ pageParam }) => fetchJams({ pageParam, filter }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
});

// Intersection Observer와 연동
useEffect(() => {
  if (inView && hasNextPage) fetchNextPage();
}, [inView, hasNextPage]);
```

## 라우팅 구조

### Route Groups

Next.js App Router에서 `(폴더명)`은 URL에 포함되지 않는 그룹입니다.

| 그룹 | 용도 | 보호 |
|------|------|------|
| `(pages)` | 모든 페이지의 공통 레이아웃 | - |
| `(only-user)` | 로그인 필수 페이지 | 인증 검증 |
| `(signin)` | 로그인/회원가입 페이지 | 이미 로그인 시 리다이렉트 |

### URL 매핑

| 파일 경로 | URL |
|----------|-----|
| `app/(pages)/(signin)/page.tsx` | `/` |
| `app/(pages)/(signin)/signup/page.tsx` | `/signup` |
| `app/(pages)/(only-user)/jamsession/page.tsx` | `/jamsession` |
| `app/(pages)/(only-user)/jamsession/post/[id]/page.tsx` | `/jamsession/post/123` |
| `app/(pages)/(only-user)/mypage/page.tsx` | `/mypage` |
| `app/(pages)/(only-user)/myact/page.tsx` | `/myact` |
| `app/(pages)/(only-user)/user-profile/[nickname]/page.tsx` | `/user-profile/john` |

### 레이아웃 계층

```
app/layout.tsx (Root: 메타데이터, Analytics)
└── app/(pages)/layout.tsx (Global: Context, QueryClient)
    ├── app/(pages)/(signin)/layout.tsx (비인증: 로그인 체크)
    │   └── page.tsx (/)
    │   └── signup/page.tsx (/signup)
    │
    └── app/(pages)/(only-user)/layout.tsx (인증: 세션 검증)
        └── jamsession/layout.tsx
            └── page.tsx (/jamsession)
            └── post/[id]/page.tsx (/jamsession/post/:id)
        └── mypage/page.tsx (/mypage)
        └── myact/page.tsx (/myact)
```

## 관련 문서

- [Context](../context/README.md) - 프로젝트 컨텍스트
- [Patterns](../patterns/README.md) - 코드 패턴
- [Design](../design/README.md) - 디자인 시스템 가이드
- [Reference](../reference/README.md) - API/스키마 레퍼런스
