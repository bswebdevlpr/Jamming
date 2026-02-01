# Patterns

> 일관된 코드 작성을 위한 패턴 및 컨벤션 가이드

## 네이밍 규칙

### 파일/폴더

| 유형 | 규칙 | 예시 |
|------|------|------|
| 페이지 | Next.js 예약어 | `page.tsx`, `layout.tsx` |
| 컴포넌트 | kebab-case | `jam-now.tsx`, `bottom-sheet.tsx` |
| 복합 컴포넌트 | `.component.tsx` suffix | `member.component.tsx` |
| Server Action | 동사 기반 | `create.ts`, `read.ts`, `delete.ts` |
| Enum | `.enum.ts` suffix | `genre.enum.ts`, `position.enum.ts` |
| Interface | `.interface.ts` suffix | `entity.interface.ts` |
| 유틸리티 | 동사 기반 | `validate.ts`, `convert.ts` |

### 변수/함수

| 유형 | 규칙 | 예시 |
|------|------|------|
| 함수 | camelCase, 동사 시작 | `createJamEntry`, `fetchJams` |
| 변수 | camelCase | `isLoading`, `userProfile` |
| 상수 | UPPER_SNAKE_CASE | `MAX_HEADCOUNT` |
| Interface | PascalCase, 접두어 | `Entity_User`, `CreateJamDto` |
| Enum | PascalCase | `GenreEnum`, `PositionEnum` |
| Context | camelCase | `globalContext` |

### TypeScript 타입 접두어

| 접두어 | 용도 | 예시 |
|--------|------|------|
| `Entity_` | DB 엔티티 | `Entity_User`, `Entity_JamSession` |
| `Create` | 생성 DTO | `CreateJamDto`, `CreateJamEntryDto` |
| `ZodType_` | Zod 추론 타입 | `ZodType_Song`, `ZodType_HeadCnt` |
| `Filter_` | 필터 파라미터 | `Filter_JamSessionFeed` |

## 컴포넌트 패턴

### 페이지 컴포넌트

```typescript
// app/(pages)/(only-user)/jamsession/page.tsx
"use client";

// 1. Imports (표준 라이브러리 → 외부 → 내부)
import { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { globalContext } from "../../context";
import TopNavBar from "@/app/ui/navbar/jamsession/top";

export default function JamSession() {
  // 2. Context
  const { bottomSheet, session } = useContext(globalContext);

  // 3. Refs
  const childRef = useRef<FeedMethods>(null);

  // 4. States
  const [filter, setFilter] = useState<Filter>({ /* ... */ });
  const [isLoading, setIsLoading] = useState(true);

  // 5. Effects
  useEffect(() => {
    // 초기화 로직
  }, [dependencies]);

  // 6. Handlers (필요시)
  const handleClick = () => { /* ... */ };

  // 7. Render
  return (
    <div className="...">
      <TopNavBar />
      {/* ... */}
    </div>
  );
}
```

### UI 컴포넌트

```typescript
// app/ui/buttons/jam-now.tsx
"use client";

import { Dispatch, SetStateAction, useState } from "react";

// Props를 인라인 타입으로 정의
export default function JamNow({
  selectedDate,
  setSelectedDate,
  refetch,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
  refetch: () => void;
}) {
  // 로컬 상태
  const [isTurnedOn, setIsTurnedOn] = useState(false);

  return (
    <span onClick={() => setIsTurnedOn(true)}>
      {/* ... */}
    </span>
  );
}
```

### 복합 컴포넌트 (Render Function)

많은 props가 필요한 경우 함수형으로 작성:

```typescript
// app/(pages)/(only-user)/myact/[id]/components/member.component.tsx
"use client";

export const MemberComponent = (
  idx: number,
  jam: Entity_JamSession,
  entry: Entity_JamEntry,
  isMyJam: boolean,
  letOutMember: (entryId: number) => void,
  bottomSheet: BottomSheetContext,
) => {
  const { nickname, profile_image } = entry.user;
  const isPast = moment(jam.created_at).isBefore(moment());

  return (
    <div key={idx} className="...">
      {/* ... */}
    </div>
  );
};

// 사용
{entries.map((entry, idx) => MemberComponent(idx, jam, entry, isMyJam, letOutMember, bottomSheet))}
```

## Server Action 패턴

### 기본 구조

```typescript
// app/api/functions/create.ts
"use server";

import { CustomError } from "@/app/lib/errors/server.error";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function createJamEntry(
  input: CreateJamEntryDto
): Promise<boolean> {
  let ret: boolean = false;

  try {
    // 1. 입력 검증/새니타이징
    input.appeal = await sanitize(input.appeal);

    // 2. Supabase 클라이언트 생성
    const supabase = await createClient();

    // 3. DB 작업
    const { error } = await supabase.from("jamentry").insert(input);

    // 4. 결과 처리
    ret = !error;
  } catch (e) {
    // 5. 에러 처리
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
}
```

### Read 패턴 (Relation Query)

```typescript
// app/api/functions/read.ts
"use server";

export async function getJam(id: number): Promise<Entity_JamSession> {
  let ret: Entity_JamSession = null;

  try {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // Relation 쿼리
    const { data, error } = await supabase
      .from("jamsession")
      .select(`
        *,
        user ( nickname, pos, genre, level, bpm, profile_image ),
        jamentry ( id, jam_id, user_id, applied_pos )
      `)
      .eq("id", id)
      .single();

    if (error) throw CustomError.UnExpected;
    if (!data) throw CustomError.InvalidJam;

    // 계산 필드 추가
    data.curHeadCnt = data.jamentry.length;
    data.maxHeadCnt = data.headcnt_by_pos.reduce(
      (acc, cur) => acc + cur.headcnt, 0
    );

    ret = data;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
}
```

### API Route Handler 패턴

```typescript
// app/api/maniadb/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { FetchResult } from "../types/response.interface";

export async function POST(req: NextRequest) {
  // 1. 요청 파싱
  const { songName } = await req.json();

  // 2. 입력 검증
  if (!songName) {
    return NextResponse.json({
      status: 500,
      msg: "Failed to get the name of song.",
      data: null,
    });
  }

  try {
    // 3. 외부 API 호출
    const data: FetchResult = await axios
      .get(`https://www.maniadb.com/api/search/${songName}/?...`)
      .then((res) => ({
        status: 200,
        msg: "Success",
        data: res.data,
      }))
      .catch(() => ({
        status: 500,
        msg: "Failed to request",
        data: null,
      }));

    // 4. 응답 반환
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({
      status: 500,
      msg: "Error",
      data: null,
    });
  }
}
```

## 에러 처리 패턴

### CustomError 클래스

```typescript
// app/lib/errors/server.error.ts
const postfix = " 문제가 지속적으로 발생한다면 피드백을 전송해주세요.";

export class CustomError extends Error {
  constructor(msg: string) {
    super(msg);
  }

  // 정적 인스턴스로 에러 정의
  static Forbidden = new CustomError("권한이 없습니다.");
  static UnExpected = new CustomError("예기치 못한 문제가 발생했습니다." + postfix);
  static InvalidUserSession = new CustomError("회원정보를 불러오는 데에 실패했습니다...");
  static InvalidJam = new CustomError("유효하지 않은 잼세션입니다.");
  static InvalidUser = new CustomError("일치하는 유저를 찾을 수 없습니다.");
  // ...
}
```

### 에러 처리 패턴

```typescript
try {
  // 비즈니스 로직
  const { data, error } = await supabase.from("...").select();

  if (error) throw CustomError.UnExpected;
  if (!data) throw CustomError.InvalidJam;

  // 성공 처리
  return data;
} catch (e) {
  // 개발 환경에서만 로깅
  if (process.env.NODE_ENV === "development") console.error(e);

  // CustomError는 그대로 던지기
  if (e instanceof CustomError) throw e;

  // 알 수 없는 에러는 UnExpected로 래핑
  else throw CustomError.UnExpected;
}
```

### 클라이언트 에러 (동일 구조)

```typescript
// app/lib/errors/client.error.ts
"use client";

export class CustomError extends Error {
  static CreateJamSession = new CustomError("잼세션을 생성하는데에 실패했습니다...");
  static SearchSong = new CustomError("곡 검색에 실패했습니다...");
  // ...
}
```

## Supabase 쿼리 패턴

### Relation Query

```typescript
// FK 관계 데이터 포함
const { data } = await supabase
  .from("jamsession")
  .select(`
    *,
    user ( nickname, pos, genre, level, profile_image ),
    jamentry ( id, user_id, applied_pos, is_allowed )
  `)
  .eq("id", id)
  .single();
```

### 필터 쿼리 (조건부)

```typescript
let query = supabase.from("jamsession").select(`*`);

// 조건부 필터 추가
if (filter.location) {
  query = query.contains("location", [MapLocationToData[filter.location]]);
}
if (filter.genre) {
  query = query.contains("genre", [MapGenreToData[filter.genre]]);
}
if (filter.level) {
  query = query.contains("level", [MapLevelToData[filter.level]]);
}

// 정렬 및 페이지네이션
query = query
  .order("datetime", { ascending: true })
  .range(pageParam * 6, pageParam * 6 + 5);

const { data } = await query;
```

### Storage 업로드

```typescript
// 이미지 업로드
const { data, error } = await supabase.storage
  .from(process.env.SUPABASE_STORAGE_NAME!)
  .upload(`jamsession/${sessionId}/${filename}`, file);

// 공개 URL 생성
const { data: { publicUrl } } = supabase.storage
  .from(process.env.SUPABASE_STORAGE_NAME!)
  .getPublicUrl(data.path);
```

## 상태 관리 패턴

### Context 사용

```typescript
// 가져오기
const { bottomSheet, session, setSmallLoading } = useContext(globalContext);

// Bottom Sheet 열기
bottomSheet.set({
  children: <MyComponent onClose={() => bottomSheet.set({ children: null })} />,
  location: BottomSheetHeight.Half,
});

// 사용자 프로필 업데이트
session.setUserProfile({ nickname: "새닉네임" });

// 로딩 토글
setSmallLoading();
```

### React Query 무한 스크롤

```typescript
const { data, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteQuery({
  queryKey: ["jamsessions", filter],
  queryFn: ({ pageParam = 0 }) => fetchJams({ pageParam, filter }),
  getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  initialPageParam: 0,
  staleTime: 1000 * 60 * 5,  // 5분 캐싱
  refetchOnWindowFocus: false,
});

// Intersection Observer 연동
const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage && !isLoading) {
    fetchNextPage();
  }
}, [inView, hasNextPage, isLoading]);

// 렌더링
return (
  <>
    {data?.pages.map((page) =>
      page.data.map((item) => <Card key={item.id} {...item} />)
    )}
    <div ref={ref} />  {/* 트리거 요소 */}
  </>
);
```

## 관련 문서

- [Context](../context/README.md) - 프로젝트 컨텍스트
- [Architecture](../architecture/README.md) - 시스템 구조
- [Reference](../reference/README.md) - API/스키마 레퍼런스
