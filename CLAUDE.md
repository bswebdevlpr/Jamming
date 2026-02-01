# Jamming FE

> 음악인을 위한 합주/잼 세션 매칭 모바일 웹 플랫폼

## Rules

- 패키지 매니저는 반드시 **pnpm** 사용 (npm, yarn 사용 금지)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 RC, Tailwind CSS 4, Framer Motion |
| State | React Context, TanStack React Query 5 |
| Backend | Supabase (Auth, DB, Storage) |
| External API | ManiaDB (곡 검색), Naver Map (장소 검색) |

## Project Structure

```
app/
├── (pages)/
│   ├── (signin)/          # 비회원 영역 (로그인, 가입)
│   ├── (only-user)/       # 인증 필수 영역 (잼 세션, 마이페이지)
│   ├── context.tsx        # GlobalContext
│   └── layout.tsx         # Global providers
├── api/                   # Server Actions & Route Handlers
│   ├── functions/         # CRUD 서버 함수
│   ├── maniadb/           # 곡 검색 API
│   ├── naver/             # 장소 검색 API
│   └── auth/              # OAuth 콜백
├── lib/                   # enums, interfaces, utils
├── ui/                    # 디자인 시스템, 컴포넌트
└── util/supabase/         # Supabase client/server helpers
```

## Key Files

| Purpose | Path |
|---------|------|
| 앱 진입점 | `app/layout.tsx` |
| 글로벌 상태 | `app/(pages)/context.tsx` |
| 인증 유틸 | `app/util/supabase/auth.ts` |
| 타입 정의 | `app/lib/interfaces/entity.interface.ts` |
| 잼 세션 CRUD | `app/(pages)/(only-user)/jamsession/functions/fetch.ts` |
| API 함수 | `app/api/functions/read.ts`, `create.ts`, `delete.ts` |
| 글로벌 CSS | `app/ui/global.css` |
| Zod 스키마 | `app/lib/zod.ts` |

## Documentation

작업 전 docs 폴더 참조: `docs/context/` → `docs/architecture/` → `docs/patterns/` 순서
