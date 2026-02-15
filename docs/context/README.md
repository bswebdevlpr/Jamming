# Context

> AI가 프로젝트를 처음 접할 때 가장 먼저 읽어야 할 문서

## 프로젝트 개요

**JAMMING** - 음악인을 위한 합주/잼 세션 매칭 모바일 웹 플랫폼

음악인들이 함께 연주할 파트너를 찾고, 잼 세션을 개최하거나 참여하는 과정을 간편하게 만드는 서비스입니다.

| 항목       | 내용                         |
| ---------- | ---------------------------- |
| 서비스 URL | https://jamming.co.kr        |
| 플랫폼     | 모바일 웹 (PWA)              |
| 주요 타겟  | 한국 내 아마추어/취미 음악인 |

## 핵심 목표 및 가치

1. **매칭 간소화**: 지역 기반으로 음악인들이 쉽게 만날 수 있도록
2. **다양성 존중**: 장르, 실력 수준에 관계없이 누구나 참여 가능
3. **모바일 최적화**: 언제 어디서나 빠르게 세션 확인/신청

## 비즈니스 도메인

### JamSession (잼 세션)

호스트가 개최하는 합주 모임입니다.

```typescript
// 핵심 필드
{
  title: string;              // 세션 제목 (5-20자)
  body: string;               // 상세 설명 (최대 1000자)
  datetime: string;           // 일시
  location: LocationEnum[];   // 지역 (복수 선택)
  location_detail: {          // 정확한 장소
    name: string;
    address: string;
  };
  genre: GenreEnum[];         // 장르 (복수 선택)
  level: LevelEnum[];         // 실력대 (복수 선택)
  headcnt_by_pos: Array<{     // 포지션별 모집 인원
    pos: PositionEnum;
    headcnt: number;
  }>;
  songs: Array<{              // 합주할 곡 목록
    title: string;
    artist: string;
  }>;
}
```

### JamEntry (참가 신청)

사용자가 잼 세션에 참가 신청하는 것입니다.

```typescript
{
  jam_id: number; // 신청할 세션
  user_id: string; // 신청자
  appeal: string; // 자기소개
  applied_pos: PositionEnum; // 신청 포지션
  is_allowed: boolean; // 호스트 승인 여부
  is_rejam: boolean; // 재잼(재신청) 여부
}
```

**플로우:**

1. 사용자가 세션 상세 페이지에서 참가 신청
2. 호스트가 신청 목록 확인 후 승인/거절
3. 승인된 사용자만 참가 확정

### User (사용자)

```typescript
{
  nickname: string;           // 닉네임 (1-8자, 영문/한글/숫자)
  profile_image: string;      // 프로필 이미지 URL
  pos: PositionEnum;          // 주 포지션
  genre: GenreEnum;           // 선호 장르
  level: LevelEnum;           // 실력 수준
  location: LocationEnum;     // 활동 지역
  tags: string[];             // 태그 (#rock, #blues 등)
  bpm: number;                // BPM (선택)
}
```

### Enum 분류 체계

**장르 (GenreEnum)**

- 종합, 락, 팝, 인디, 재즈, 펑크, 메탈

**포지션 (PositionEnum)**

- 기타, 베이스, 드럼, 보컬, 키보드, 그 외

**레벨 (LevelEnum)**

- 프로, 아마추어, 스터디, 취미

**지역 (LocationEnum)**

- 전체, 서울, 경기 북부, 경기 남부, 인천, 부산, 대구, 대전, 광주, 울산, 세종, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주 (19개)

## 기술적 제약조건

### 모바일 퍼스트

- **뷰포트 제한**: `min-width: 375px`, `max-width: 600px`
- **터치 최적화**: Bottom Sheet, 스와이프 제스처 지원
- **반응형 아님**: 모바일 전용 레이아웃

### iOS Safari 호환

프로젝트에서 가장 많은 디버깅 리소스가 투입된 영역입니다.

- **자동 확대 방지**: `maximum-scale=1` 설정
- **주소창 높이 대응**: `--vh` CSS 변수로 동적 계산
- **스크롤 동작 최적화**: `overflow-without-scroll` 클래스
- **키보드 입력 시 화면 움직임 제어**

### 기술 스택 제약

| 항목      | 버전/기술  | 비고                   |
| --------- | ---------- | ---------------------- |
| Framework | Next.js 16 | App Router 사용        |
| React     | 19 RC      | RC 버전                |
| Tailwind  | 4          | 최신 버전              |
| Backend   | Supabase   | Auth, DB, Storage 통합 |
| 배포      | Vercel     | Analytics 활성화       |

### 외부 API 의존성

- **ManiaDB**: 곡 검색 (한국 음악 DB)
- **Naver Map**: 장소 검색 (Local Search API)
- **Kakao**: OAuth 로그인

## 관련 문서

- [Architecture](../architecture/README.md) - 시스템 구조
- [Patterns](../patterns/README.md) - 코드 패턴
- [Design](../design/README.md) - 디자인 시스템 가이드
- [Reference](../reference/README.md) - API/스키마 레퍼런스
