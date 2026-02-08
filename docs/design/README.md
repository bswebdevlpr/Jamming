# Design Guide

> 프로젝트 디자인 시스템 및 스타일 가이드

## 핵심 원칙

**프론트엔드 작업 또는 디자인 요소 생성 시, 프로젝트 전반의 분위기(컬러 팔레트, 폰트 체계, 다크 모드 톤)를 절대 해치지 않아야 합니다.**

- 새 컴포넌트나 스타일 추가 시 반드시 아래 정의된 디자인 토큰과 패턴을 준수할 것
- 허용된 컬러 목록 외 임의 색상 사용 금지
- 정의된 폰트 외 다른 폰트 사용 금지
- 다크 모드 기반의 어두운 톤을 유지하고, 밝은 배경이나 과도한 컬러 사용 자제

## CSS 변수 (Design Tokens)

`app/ui/global.css`의 `:root`에 정의된 핵심 토큰:

| 변수 | 값 | 용도 |
|------|-----|------|
| `--background` | `#111113` | 앱 배경 (거의 블랙) |
| `--foreground` | `#ededed` | 기본 텍스트 (거의 화이트) |
| `--highlight` | `#a3ff0c` | 브랜드 강조색 (옐로 그린) |
| `--border` | `#323234` | 기본 보더 |
| `--min-width` | `375px` | 최소 뷰포트 너비 |
| `--max-width` | `600px` | 최대 뷰포트 너비 |
| `--font-size` | `14px` | 기본 폰트 크기 |
| `--vh` | `1vh` | iOS Safari 뷰포트 높이 단위 |

## 컬러 팔레트

### 브랜드/액센트

| 컬러 | HEX | 용도 |
|-------|-----|------|
| Highlight (Green) | `#A3FF0C` | 활성 상태, 선택 상태, 장르 태그, 브랜드 강조 |
| Blue | `#0C7CFF` | 스위치 활성, 보조 강조 |
| Location Blue | `#3994FF` | 지역 태그 |
| Pink | `#FF3773` | 포지션 태그 |
| Red | `#FF3E2F` | 삭제, 경고 |

### 뉴트럴 (그레이 스케일)

| 컬러 | HEX | 용도 |
|-------|-----|------|
| Background | `#111113` | 앱 배경 |
| Deep BG | `#242426` | 카드 배경, 레벨 태그 배경 |
| Border / Inactive BG | `#323234` | 보더, 비활성 버튼 배경, 셀렉트 배경 |
| Dark Gray | `#444447` | 비활성 보더, 스위치 비활성 배경 |
| Mid Gray (Border) | `#535355` | 버튼 보더 |
| Mid Gray (Text) | `#9F9FA2` | 비활성 텍스트, 보조 텍스트, 스위치 비활성 썸 |
| Light Gray | `#c0c0c5` | 영문 폰트 기본색 |
| Near White | `#E5E5E9` | 국문 폰트 기본색, 레벨 태그 텍스트 |
| Foreground | `#ededed` | 기본 텍스트 |

### 시맨틱 배경 (투명도 포함)

태그 및 인터랙션에 사용하는 반투명 배경:

| 용도 | 값 |
|------|-----|
| 장르 태그 배경 | `rgba(163, 255, 12, 0.16)` |
| Hover/Tap 효과 | `rgba(163, 255, 12, 0.12)` |
| 활성 버튼 배경 | `#304313` |
| 포지션 태그 배경 | `rgba(255, 55, 115, 0.24)` |
| 지역 태그 배경 | `rgba(12, 124, 255, 0.20)` |
| 레벨 태그 배경 | `#242426` |

## 타이포그래피

### 폰트 패밀리

#### 영문 폰트 (SBAggro)

| 폰트 | 굵기 | 용도 |
|-------|------|------|
| `SBAggroL` | Light | 대형 텍스트, 브랜딩 |
| `SBAggroM` | Medium | 일반 UI 요소 |
| `SBAggroB` | Bold | 강조 |

권장 스타일 (실제 사용 시 적용):
- 텍스트 색상: `#c0c0c5`
- Letter spacing: `0`
- Line height: `140%`

폰트 로딩 전략: 모든 폰트는 `font-display: swap`으로 설정되어 있습니다.

#### 국문 폰트 (SUIT)

| 폰트 | 굵기 | 용도 |
|-------|------|------|
| `SUIT-TITLE` | SemiBold | 제목, 라벨 |
| `SUIT-BODY` | Regular | 본문, 버튼, 태그 |

공통 속성: `color: #e5e5e9`, `letter-spacing: -2.5%`, `line-height: 140~150%`

#### 보조 폰트 (Pretendard)

단일 font-family로 통합되어 있으며, font-weight로 굵기를 조절합니다.

| font-weight | 굵기 | 용도 |
|-------------|------|------|
| `400` | Regular | Material UI 달력, 보조 텍스트 |
| `500` | Medium | 일반 UI |
| `600` | SemiBold | 강조 |

**사용 예시**: `font-family: "Pretendard"; font-weight: 500;`

### 폰트 크기 가이드

| 크기 | 용도 |
|------|------|
| `1rem` (16px) | 버튼 텍스트, 입력 필드 |
| `0.875rem` (14px) | 라벨, 셀렉트 항목 |
| `0.75rem` (12px) | 태그, 보조 텍스트 |

## 레이아웃

### 뷰포트 제약

- **최소 너비**: 375px (iPhone SE 기준)
- **최대 너비**: 600px (모바일 웹 전용)
- **가로 중앙 정렬**: `margin: 0 auto`
- **전체 높이**: `height: 100%`

### 스크롤

```css
/* 스크롤바 숨김 유틸리티 */
.overflow-without-scroll {
  overflow: auto;
  -ms-overflow-style: none;    /* IE/Edge */
  scrollbar-width: none;        /* Firefox */
}
.overflow-without-scroll::-webkit-scrollbar {
  display: none;                /* Chrome, Safari */
}
```

## 컴포넌트 스타일 규격

### Button (`app/ui/templates/buttons.tsx`)

공통 스타일:

| 속성 | 값 |
|------|-----|
| `width` | `100%` |
| `borderRadius` | `8px` |
| `padding` | `10px 12px` |
| `fontFamily` | `SUIT-BODY` |
| `fontSize` | `1rem` |

상태별 스타일:

| 상태 | 텍스트 색 | 보더 | 배경 |
|------|-----------|------|------|
| Inactive | `#9F9FA2` | `1px solid #444447` | `#323234` |
| Active | `#A3FF0C` | `1px solid #A3FF0C` | `#304313` |

### Tag (`app/ui/tags/category-tag.tsx`)

공통 스타일:

| 속성 | 값 |
|------|-----|
| `fontFamily` | `SUIT-BODY` |
| `fontSize` | `0.75rem` |
| `borderRadius` | `2px` |
| `padding` | `px-1.5 py-0.5` |
| `whiteSpace` | `nowrap` |

태그 유형별 컬러:

| 유형 | 텍스트 색 | 배경 |
|------|-----------|------|
| Position (포지션) | `#FF3773` | `rgba(255, 55, 115, 0.24)` |
| Genre (장르) | `#A3FF0C` | `rgba(163, 255, 12, 0.16)` |
| Location (지역) | `#3994FF` | `rgba(12, 124, 255, 0.20)` |
| Level (레벨) | `#E5E5E9` | `#242426` |

태그 표시 순서: Location → Position → Genre → Level

### Switch (`app/ui/templates/switch.tsx`)

Radix UI Switch 기반:

| 속성 | 값 |
|------|-----|
| Root 크기 | `51px × 26px` |
| Thumb 크기 | `22px × 22px` |
| `borderRadius` | `9999px` |
| 트랜지션 | `transform 200ms` |

상태별 스타일:

| 상태 | Root 배경 | Thumb 색 | Thumb 위치 |
|------|-----------|----------|------------|
| Off | `#444447` | `#9F9FA2` | `translateX(2px)` |
| On | `#0C7CFF` | `#FFF` | `translateX(27px)` |

### Select (`app/ui/templates/select.tsx`)

Radix UI Select 기반:

| 속성 | 값 |
|------|-----|
| 크기 | `164px × 33px` |
| `backgroundColor` | `#323234` |
| `borderRadius` | `3px` |
| 항목 보더 | `1px solid #9F9FA2` |
| `fontFamily` | `SUIT-BODY` |
| `fontSize` | `0.875rem` |

## 애니메이션 (Framer Motion)

인터랙션 효과에 Framer Motion 사용:

```typescript
// Hover 효과
whileHover={{ background: "rgba(163, 255, 12, 0.12)" }}

// Tap 효과
whileTap={{ background: "rgba(163, 255, 12, 0.12)" }}
```

스위치 전환:
```css
transition: transform 200ms;
will-change: transform;
```

## iOS Safari 대응

### 입력 필드 자동 확대 방지

모든 `input`, `textarea`, `select` 요소에 적용 (`app/ui/global.css`):

```css
input, textarea, select {
  font-size: 16px;            /* 최소 16px 이상 필수 */
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
}

input::placeholder, textarea::placeholder {
  font-size: 16px;
  opacity: 0.6;
}
```

### 뷰포트 높이

`--vh` CSS 변수를 사용하여 iOS Safari 주소창 높이 변화에 대응.

## UI 라이브러리 의존성

접근성을 위해 Radix UI 프리미티브 사용:

| 패키지 | 용도 |
|--------|------|
| `@radix-ui/react-avatar` | 아바타 |
| `@radix-ui/react-switch` | 토글 스위치 |
| `@radix-ui/react-select` | 셀렉트 드롭다운 |
| `@radix-ui/react-checkbox` | 체크박스 |

## 관련 파일

| 파일 | 설명 |
|------|------|
| `app/ui/global.css` | CSS 변수, 폰트 정의, 글로벌 스타일 |
| `tailwind.config.ts` | Tailwind 테마 확장 (`background`, `foreground`) |
| `app/ui/templates/buttons.tsx` | 버튼 템플릿 |
| `app/ui/tags/category-tag.tsx` | 태그 컴포넌트 (4종) |
| `app/ui/templates/switch.tsx` | 스위치 컴포넌트 |
| `app/ui/templates/select.tsx` | 셀렉트 컴포넌트 |

## 관련 문서

- [Context](../context/README.md) - 프로젝트 컨텍스트
- [Architecture](../architecture/README.md) - 시스템 구조
- [Patterns](../patterns/README.md) - 코드 패턴
