# Jamming FE

> 음악인을 위한 합주/잼 세션 매칭 모바일 웹 플랫폼

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 RC, Tailwind CSS 4, Framer Motion |
| State | React Context, TanStack React Query 5 |
| Backend | Supabase (Auth, DB, Storage) |
| External API | ManiaDB (곡 검색), Naver Map (장소 검색) |
| Package Manager | pnpm |

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

<!-- AI: 프로젝트 작업 전 docs/context → docs/architecture → docs/patterns 순으로 읽어주세요 -->

| Directory | Purpose | AI 우선순위 |
|-----------|---------|------------|
| [docs/context/](docs/context/) | 프로젝트 컨텍스트 (목표, 제약조건, 핵심 개념) | 1순위 - 먼저 읽기 |
| [docs/architecture/](docs/architecture/) | 시스템 아키텍처 (데이터 흐름, 인증 플로우) | 2순위 |
| [docs/patterns/](docs/patterns/) | 코드 패턴 & 컨벤션 (네이밍, 구조) | 3순위 |
| [docs/reference/](docs/reference/) | API/스키마 레퍼런스 (Supabase, 엔드포인트) | 필요시 참조 |
| [docs/decisions/](docs/decisions/) | 기술 결정 기록 (ADR) | 필요시 참조 |
| [docs/tasks/](docs/tasks/) | 작업 추적 (진행 중/예정 작업) | 연속 작업시 참조 |

## Quick Start

```bash
# 설치
pnpm install

# 개발 서버 (port 3038)
pnpm dev

# 빌드
pnpm build

# 프로덕션
pnpm start
```

## Environment Variables

| Name | Description |
|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `DOMAIN` | OAuth 리디렉션 베이스 URL |
| `SUPABASE_STORAGE_NAME` | Storage 버킷명 |
| `NAVER_MAP_ID` | 네이버 지도 API ID |
| `NAVER_MAP_SECRET` | 네이버 지도 API Secret |

> `.env.local` 파일은 Git에 포함되지 않음
