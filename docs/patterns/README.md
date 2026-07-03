# Patterns

> A guide to patterns and conventions for writing consistent code

## Naming Conventions

### Files/Folders

| Type | Convention | Example |
|------|------------|---------|
| Page | Next.js reserved names | `page.tsx`, `layout.tsx` |
| Component | kebab-case | `jam-now.tsx`, `bottom-sheet.tsx` |
| Compound component | `.component.tsx` suffix | `member.component.tsx` |
| Server Action | verb-based | `create.ts`, `read.ts`, `delete.ts` |
| Enum | `.enum.ts` suffix | `genre.enum.ts`, `position.enum.ts` |
| Interface | `.interface.ts` suffix | `entity.interface.ts` |
| Utility | verb-based | `validate.ts`, `convert.ts` |

### Variables/Functions

| Type | Convention | Example |
|------|------------|---------|
| Function | camelCase, starts with a verb | `createJamEntry`, `fetchJams` |
| Variable | camelCase | `isLoading`, `userProfile` |
| Constant | UPPER_SNAKE_CASE | `MAX_HEADCOUNT` |
| Interface | PascalCase, prefixed | `Entity_User`, `CreateJamDto` |
| Enum | PascalCase | `GenreEnum`, `PositionEnum` |
| Context | camelCase | `globalContext` |

### TypeScript Type Prefixes

| Prefix | Purpose | Example |
|--------|---------|---------|
| `Entity_` | DB entity | `Entity_User`, `Entity_JamSession` |
| `Create` | Creation DTO | `CreateJamDto`, `CreateJamEntryDto` |
| `ZodType_` | Zod inferred type | `ZodType_Song`, `ZodType_HeadCnt` |
| `Filter_` | Filter parameters | `Filter_JamSessionFeed` |

## Component Patterns

### Page Component

```typescript
// app/(pages)/(only-user)/jamsession/page.tsx
"use client";

// 1. Imports (standard library → external → internal)
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
    // Initialization logic
  }, [dependencies]);

  // 6. Handlers (if needed)
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

### UI Component

```typescript
// app/ui/buttons/jam-now.tsx
"use client";

import { Dispatch, SetStateAction, useState } from "react";

// Define Props as an inline type
export default function JamNow({
  selectedDate,
  setSelectedDate,
  refetch,
}: {
  selectedDate: moment.Moment;
  setSelectedDate: Dispatch<SetStateAction<moment.Moment>>;
  refetch: () => void;
}) {
  // Local state
  const [isTurnedOn, setIsTurnedOn] = useState(false);

  return (
    <span onClick={() => setIsTurnedOn(true)}>
      {/* ... */}
    </span>
  );
}
```

### Compound Component (Render Function)

When many props are required, write it as a function:

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

// Usage
{entries.map((entry, idx) => MemberComponent(idx, jam, entry, isMyJam, letOutMember, bottomSheet))}
```

## Server Action Patterns

### Basic Structure

```typescript
// app/api/functions/create.ts
"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import { createClient } from "@/app/util/supabase/server";
import { CreateJamEntryDto } from "../dtos/create";
import { sanitize } from "@/app/lib/functions/validate";

export async function createJamEntry(
  input: CreateJamEntryDto
): Promise<boolean> {
  let ret: boolean = false;

  try {
    // 1. Validate/sanitize input
    input.appeal = await sanitize(input.appeal);

    // 2. Create Supabase client
    const supabase = await createClient();

    // 3. DB operation
    const { error } = await supabase.from("jamentry").insert(input);

    // 4. Handle result
    ret = !error;
  } catch (e) {
    // 5. Error handling
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
}
```

### Read Pattern (Relation Query)

```typescript
// app/api/functions/read.ts
"use server";

export async function getJam(id: number): Promise<Entity_JamSession> {
  let ret: Entity_JamSession = null;

  try {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // Relation query
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

    // Add computed fields
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

### API Route Handler Pattern

```typescript
// app/api/maniadb/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { FetchResult } from "../types/response.interface";

export async function POST(req: NextRequest) {
  // 1. Parse request
  const { songName } = await req.json();

  // 2. Validate input
  if (!songName) {
    return NextResponse.json({
      status: 500,
      msg: "Failed to get the name of song.",
      data: null,
    });
  }

  try {
    // 3. Call external API
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

    // 4. Return response
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

## Error Handling Patterns

### CustomError Class

```typescript
// app/lib/errors/custom-error.ts
const postfix = " 문제가 지속적으로 발생한다면 피드백을 전송해주세요.";

export class CustomError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CustomError";
  }

  // Common errors
  static Forbidden = new CustomError("권한이 없습니다.");
  static UnExpected = new CustomError("예기치 못한 문제가 발생했습니다." + postfix);
  static InvalidUserSession = new CustomError("회원정보를 불러오는 데에 실패했습니다." + postfix);
  static InvalidJam = new CustomError("유효하지 않은 잼세션입니다.");
  static InvalidUser = new CustomError("일치하는 유저를 찾을 수 없습니다.");

  // Server-only
  static UpdatePlaylistItem = new CustomError("연주목록 항목 업데이트에 실패했습니다." + postfix);
  static UploadImage = new CustomError("이미지 업로드에 실패했습니다." + postfix);

  // Client-only
  static CreateJamSession = new CustomError("잼세션을 생성하는데에 실패했습니다." + postfix);
  static SearchSong = new CustomError("곡 검색에 실패했습니다." + postfix);
}
```

### Error Handling Pattern

```typescript
try {
  // Business logic
  const { data, error } = await supabase.from("...").select();

  if (error) throw CustomError.UnExpected;
  if (!data) throw CustomError.InvalidJam;

  // Handle success
  return data;
} catch (e) {
  // Log only in the development environment
  if (process.env.NODE_ENV === "development") console.error(e);

  // Rethrow CustomError as-is
  if (e instanceof CustomError) throw e;

  // Wrap unknown errors as UnExpected
  else throw CustomError.UnExpected;
}
```

## Supabase Query Patterns

### Relation Query

```typescript
// Include FK-related data
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

### Filter Query (Conditional)

```typescript
let query = supabase.from("jamsession").select(`*`);

// Add conditional filters
if (filter.location) {
  query = query.contains("location", [MapLocationToData[filter.location]]);
}
if (filter.genre) {
  query = query.contains("genre", [MapGenreToData[filter.genre]]);
}
if (filter.level) {
  query = query.contains("level", [MapLevelToData[filter.level]]);
}

// Sorting and pagination
query = query
  .order("datetime", { ascending: true })
  .range(pageParam * 6, pageParam * 6 + 5);

const { data } = await query;
```

### Storage Upload

```typescript
// Upload image
const { data, error } = await supabase.storage
  .from(process.env.SUPABASE_STORAGE_NAME!)
  .upload(`jamsession/${sessionId}/${filename}`, file);

// Generate public URL
const { data: { publicUrl } } = supabase.storage
  .from(process.env.SUPABASE_STORAGE_NAME!)
  .getPublicUrl(data.path);
```

## State Management Patterns

### Using Context

```typescript
// Retrieve
const { bottomSheet, session, setSmallLoading } = useContext(globalContext);

// Open Bottom Sheet
bottomSheet.set({
  children: <MyComponent onClose={() => bottomSheet.set({ children: null })} />,
  location: BottomSheetHeight.Half,
});

// Update user profile
session.setUserProfile({ nickname: "새닉네임" });

// Toggle loading
setSmallLoading();
```

### React Query Infinite Scroll

```typescript
const { data, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteQuery({
  queryKey: ["jamsessions", filter],
  queryFn: ({ pageParam = 0 }) => fetchJams({ pageParam, filter }),
  getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  initialPageParam: 0,
  staleTime: 1000 * 60 * 5,  // 5-minute caching
  refetchOnWindowFocus: false,
});

// Intersection Observer integration
const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage && !isLoading) {
    fetchNextPage();
  }
}, [inView, hasNextPage, isLoading]);

// Rendering
return (
  <>
    {data?.pages.map((page) =>
      page.data.map((item) => <Card key={item.id} {...item} />)
    )}
    <div ref={ref} />  {/* Trigger element */}
  </>
);
```

## Related Documents

- [Context](../context/README.md) - Project context
- [Architecture](../architecture/README.md) - System structure
- [Design](../design/README.md) - Design system guide
- [Reference](../reference/README.md) - API/schema reference
