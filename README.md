<div align="center">

# 🎸 JAMMING

**음악인을 위한 합주 · 잼 세션 매칭 모바일 웹 플랫폼**

지역·장르·실력대 기반으로 함께 연주할 파트너를 찾고, 잼 세션을 개최하거나 참여하는 과정을 간편하게 만드는 서비스입니다.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19_RC-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## 📖 소개

**JAMMING**은 한국의 아마추어/취미 음악인을 대상으로 한 모바일 전용(PWA) 웹 서비스입니다.
호스트가 합주 모임(잼 세션)을 개최하면, 다른 음악인들이 자신의 포지션으로 참가를 신청하고, 호스트가 승인하는 방식으로 매칭이 이루어집니다.

> ⚠️ 본 저장소는 **포트폴리오 목적**으로 공개되었습니다. 실제 운영 인프라(Supabase 인스턴스, API 키 등)는 포함되어 있지 않으며, 모든 시크릿은 환경변수로 분리되어 있습니다.

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| 🎵 **잼 세션 CRUD** | 일시·장소·장르·실력대·포지션별 모집 인원·합주 곡 목록을 포함한 세션 개최/수정/삭제 |
| 🙋 **참가 신청 & 승인** | 포지션별 참가 신청, 호스트의 승인/거절, 재신청(re-jam) 플로우 |
| 🔔 **실시간 알림** | 신청·승인·거절 이벤트에 대한 알림, 승인 시 오픈채팅 링크 노출 |
| 🗺️ **지역 필터** | 19개 지역 기반 세션 탐색 및 필터링 |
| 🔍 **곡 · 장소 검색** | ManiaDB(곡), Naver Map(장소) 외부 API 연동 |
| 👤 **프로필 · 마이페이지** | 포지션·장르·실력·태그·플레이리스트 관리 |
| 🔐 **Kakao OAuth** | 카카오 소셜 로그인 기반 인증 |

## 🛠️ 기술 스택

| 분류 | 기술 |
| --- | --- |
| **Framework** | Next.js 16 (App Router, Server Actions) |
| **Language** | TypeScript |
| **UI** | React 19 RC · Tailwind CSS 4 · Framer Motion · MUI · Radix UI |
| **State** | Zustand · TanStack React Query 5 |
| **Form / Validation** | React Hook Form · Zod |
| **Backend** | Supabase (Auth · Postgres · Storage) |
| **Infra** | Vercel · Upstash Redis (Rate Limiting) |
| **External API** | ManiaDB(곡) · Naver Map(장소) · Kakao(OAuth) |
| **Testing** | Vitest · React Testing Library · Playwright · MSW |

## 🏗️ 아키텍처 & 설계 특징

- **모바일 퍼스트**: `375px ~ 600px` 고정 뷰포트, Bottom Sheet·스와이프 등 터치 최적화 UI
- **iOS Safari 대응**: `--vh` 동적 뷰포트 변수, 자동 확대 방지, 키보드 입력 시 레이아웃 제어
- **Server Actions 기반 CRUD**: 클라이언트 번들 최소화 및 서버 사이드 데이터 처리
- **도메인 중심 폴더 구조**: 페이지별 `functions/` 로 데이터 접근 로직 분리
- **타입 안정성**: Zod 스키마 ↔ TypeScript 인터페이스 일원화
- **테스트 커버리지**: unit · integration · component · e2e 4계층 테스트

```
app/
├── (pages)/
│   ├── (signin)/          # 비회원 영역 (로그인, 가입)
│   ├── (only-user)/       # 인증 필수 영역 (잼 세션, 마이페이지)
│   └── layout.tsx         # Global providers
├── api/                   # Server Actions & Route Handlers
│   ├── functions/         # CRUD 서버 함수
│   ├── maniadb/ · naver/  # 외부 API 프록시
│   └── auth/              # OAuth 콜백
├── lib/                   # enums, interfaces, zod schemas, utils
├── stores/                # Zustand stores
├── ui/                    # 디자인 시스템, 공통 컴포넌트
└── util/supabase/         # Supabase client/server helpers
__tests__/                 # unit · integration · component · e2e
docs/                      # 아키텍처 · 패턴 · 디자인 · 레퍼런스 문서
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 20+
- **pnpm** (필수 — npm/yarn 사용 금지)
- Supabase 프로젝트 (Auth · DB · Storage)

### 설치 및 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정 (.env.example 참고)
cp .env.example .env
#    → .env 파일에 실제 값 입력

# 3. 개발 서버 실행 (http://localhost:3038)
pnpm dev
```

### 주요 스크립트

| 명령어 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 (`:3038`) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 |
| `pnpm lint` | ESLint 검사 |
| `pnpm test` | 유닛/통합 테스트 (watch) |
| `pnpm test:run` | 테스트 1회 실행 |
| `pnpm test:coverage` | 커버리지 리포트 |
| `pnpm test:e2e` | Playwright E2E 테스트 |

## 🧪 테스트

Vitest 기반 유닛/통합/컴포넌트 테스트와 Playwright E2E 테스트로 구성되어 있으며,
외부 API 호출은 **MSW**로 모킹합니다.

```bash
pnpm test:run        # 유닛 · 통합 · 컴포넌트
pnpm test:e2e        # E2E
```

## 📚 문서

프로젝트 상세 설계 문서는 [`docs/`](./docs) 에서 확인할 수 있습니다.

| 문서 | 내용 |
| --- | --- |
| [Context](./docs/context/README.md) | 프로젝트 개요 · 도메인 모델 |
| [Architecture](./docs/architecture/README.md) | 시스템 구조 |
| [Patterns](./docs/patterns/README.md) | 코드 패턴 |
| [Design](./docs/design/README.md) | 디자인 시스템 가이드 |
| [Reference](./docs/reference/README.md) | API · 스키마 레퍼런스 |

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE) 하에 배포됩니다.
