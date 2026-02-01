# Decisions (ADR)

> Architecture Decision Records - 주요 기술 결정 사항과 그 근거를 기록

## ADR이란?

ADR(Architecture Decision Record)은 프로젝트에서 내린 중요한 기술적 결정과 그 배경을 문서화한 것입니다. AI가 "왜 이렇게 구현했는가"를 이해하는 데 도움이 됩니다.

## ADR 작성 가이드

### 언제 작성하나요?

- 새로운 기술 스택 도입
- 아키텍처 패턴 선택
- 라이브러리 선택 (여러 대안 중)
- 성능/보안 관련 중요 결정
- 기존 방식을 변경하는 결정

### 작성 원칙

1. **간결하게**: 핵심만 기록
2. **맥락 포함**: 결정 당시 상황 설명
3. **대안 기록**: 고려했던 다른 옵션
4. **결과 기록**: 결정으로 인한 영향

---

## ADR 템플릿

```markdown
# ADR-XXX: [결정 제목]

## 상태

[제안됨 | 승인됨 | 폐기됨 | 대체됨]

## 날짜

YYYY-MM-DD

## 맥락

[결정이 필요했던 배경과 상황]

## 고려한 옵션

### 옵션 1: [이름]
- 장점: ...
- 단점: ...

### 옵션 2: [이름]
- 장점: ...
- 단점: ...

## 결정

[선택한 옵션과 이유]

## 결과

[결정으로 인한 영향, 트레이드오프]
```

---

## 기록된 결정 목록

### ADR-001: 모바일 웹 전용 설계

**상태:** 승인됨
**날짜:** 프로젝트 시작 시점

**맥락:**
- 음악인들이 외부에서 빠르게 잼 세션을 확인/신청하는 사용 패턴
- 네이티브 앱 개발 리소스 부족

**고려한 옵션:**
1. 반응형 웹 (데스크톱 + 모바일)
2. 모바일 전용 웹
3. 네이티브 앱 (React Native)

**결정:** 모바일 전용 웹 선택
- 뷰포트 고정 (`min-width: 375px`, `max-width: 600px`)
- 터치 최적화 UI (Bottom Sheet, 스와이프)

**결과:**
- 빠른 개발 속도
- iOS Safari 호환성 이슈 해결에 많은 리소스 투입
- 데스크톱 사용자 경험 제한

---

### ADR-002: Supabase 선택

**상태:** 승인됨
**날짜:** 프로젝트 시작 시점

**맥락:**
- 풀스택 솔루션 필요 (Auth, DB, Storage)
- 빠른 MVP 개발 필요
- 1인 개발 환경

**고려한 옵션:**
1. Supabase (PostgreSQL + Auth + Storage)
2. Firebase (NoSQL + Auth + Storage)
3. 직접 구축 (Express + PostgreSQL + S3)

**결정:** Supabase 선택
- SQL 기반으로 복잡한 쿼리 지원
- Row Level Security로 보안 처리
- 실시간 기능 내장

**결과:**
- 빠른 개발 속도
- Relation 쿼리 편리
- 일부 고급 기능 제한

---

### ADR-003: React Query로 서버 상태 관리

**상태:** 승인됨
**날짜:** 개발 초기

**맥락:**
- 무한 스크롤 피드 구현 필요
- 캐싱 및 리페칭 로직 필요
- 로딩/에러 상태 관리

**고려한 옵션:**
1. React Query (TanStack Query)
2. SWR
3. Redux + RTK Query
4. 직접 구현 (useState + useEffect)

**결정:** React Query 선택
- `useInfiniteQuery`로 무한 스크롤 쉽게 구현
- 자동 캐싱 및 백그라운드 리페칭
- Next.js App Router와 호환

**결과:**
- 서버 상태 관리 코드 간소화
- 5분 캐싱으로 불필요한 요청 감소
- 번들 크기 증가

---

### ADR-004: Server Actions 사용

**상태:** 승인됨
**날짜:** Next.js 16 도입 시점

**맥락:**
- Next.js 16의 Server Actions 안정화
- API Route vs Server Action 선택 필요

**고려한 옵션:**
1. API Routes (기존 방식)
2. Server Actions (새로운 방식)
3. 혼합 사용

**결정:** Server Actions 주로 사용, 외부 API 프록시는 API Routes 유지
- CRUD 작업: Server Actions (`app/api/functions/`)
- 외부 API 프록시: API Routes (`app/api/maniadb/`, `app/api/naver/`)

**결과:**
- 타입 안정성 향상
- 클라이언트 코드 간소화
- 디버깅이 다소 어려움

---

### ADR-005: iOS Safari 대응 방식

**상태:** 승인됨
**날짜:** 지속적 업데이트

**맥락:**
- iOS Safari에서 다양한 레이아웃 이슈 발생
- 주소창 높이 변화, 자동 확대, 스크롤 문제

**적용된 해결책:**
1. `maximum-scale=1` 메타 태그로 자동 확대 방지
2. `--vh` CSS 변수로 동적 뷰포트 높이 계산
3. `overflow-without-scroll` 클래스로 스크롤바 숨김
4. 입력 필드 포커스 시 스크롤 제어

**결과:**
- 18회 이상의 디버깅 시도
- 현재 안정적인 모바일 경험 제공
- 코드 복잡도 증가

---

## 향후 결정 필요 사항

- [ ] 실시간 알림 구현 방식 (Supabase Realtime vs FCM)
- [ ] 이미지 최적화 방식 (Vercel Image vs Supabase Transform)
- [ ] 테스트 전략 (E2E vs Unit)

---

## 관련 문서

- [Context](../context/README.md) - 프로젝트 컨텍스트
- [Architecture](../architecture/README.md) - 시스템 구조
- [Patterns](../patterns/README.md) - 코드 패턴
