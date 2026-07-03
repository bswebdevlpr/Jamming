# Architecture

> A document for understanding the system structure, data flow, and routing

## System Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ React Query │  │   Zustand   │  │ React Components    │  │
│  │ (server st) │  │ (UI state)  │  │ (pages, UI)         │  │
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
│  │   (song search)     │  │      (place search)         │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Testing Infrastructure                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Vitest    │  │  Playwright │  │  React Testing Lib  │  │
│  │ (unit/integ)│  │    (E2E)    │  │    (components)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
app/
├── layout.tsx                    # Root layout (metadata, Analytics)
├── (pages)/
│   ├── layout.tsx                # GlobalLayout (Context, React Query Provider)
│   ├── context.tsx               # GlobalContext definition
│   ├── (only-user)/              # Authentication-required route group
│   │   ├── layout.tsx            # Auth verification layout
│   │   ├── jamsession/           # Jam session related
│   │   │   ├── page.tsx          # Feed page
│   │   │   ├── functions/        # Server Actions
│   │   │   └── post/[id]/        # Detail page
│   │   ├── myact/                # My activity
│   │   ├── mypage/               # My page
│   │   └── user-profile/[nickname]/
│   └── (signin)/                 # Unauthenticated route group
│       ├── layout.tsx            # Login state check
│       └── signup/               # Sign up
├── api/
│   ├── auth/callback/route.ts    # OAuth callback
│   ├── functions/                # Server Actions (create, read, delete)
│   ├── dtos/                     # Data Transfer Objects
│   ├── maniadb/route.ts          # ManiaDB proxy
│   └── naver/map/route.ts        # Naver Map proxy
├── lib/
│   ├── interfaces/               # TypeScript interfaces
│   ├── enums/                    # Enum definitions
│   ├── errors/                   # Error classes
│   ├── functions/                # Utility functions
│   ├── maps/                     # Enum-String mappings
│   └── zod.ts                    # Zod schemas
├── stores/                       # Zustand stores
│   ├── session.ts                # User session state
│   ├── notification.ts           # Notification state
│   ├── feedback.ts               # Feedback state
│   ├── calendar.ts               # Calendar state
│   ├── ui.ts                     # UI state
│   └── bottom-sheet.ts           # Bottom sheet state
├── ui/                           # UI components
│   ├── templates/                # Reusable templates (feed, popup)
│   ├── buttons/                  # Button components
│   ├── layouts/                  # Layout components
│   └── ...
├── util/supabase/                # Supabase client
│   ├── client.ts                 # For the browser
│   ├── server.ts                 # For the server
│   └── auth.ts                   # Auth functions
└── hooks/                        # Custom Hooks
__tests__/                        # Test files
├── setup.ts                      # Global test setup
├── mocks/                        # Mocking system
│   ├── supabase.ts               # Supabase mocking
│   ├── redis.ts                  # Redis mocking
│   ├── handlers.ts               # MSW handlers
│   └── fixtures/                 # Test data factories
├── unit/                         # Unit tests (lib, stores, hooks)
├── integration/                  # Integration tests (auth, API, external)
├── component/                    # Component tests
└── e2e/                          # E2E tests (Playwright)
```

## Authentication Flow (Kakao OAuth → Supabase)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │────▶│  /signin │────▶│  Kakao   │────▶│ Callback │
│          │     │   page   │     │  OAuth   │     │  /api/   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
                                                 ┌──────────────┐
                                                 │ Supabase     │
                                                 │ Session      │
                                                 │ created      │
                                                 └──────────────┘
                                                        │
                                         ┌──────────────┴──────────────┐
                                         ▼                             ▼
                                  ┌──────────────┐              ┌──────────────┐
                                  │ user table   │              │ user table   │
                                  │ has data     │              │ no data      │
                                  └──────────────┘              └──────────────┘
                                         │                             │
                                         ▼                             ▼
                                  ┌──────────────┐              ┌──────────────┐
                                  │ /jamsession  │              │   /signup    │
                                  │  (main)      │              │  (sign up)   │
                                  └──────────────┘              └──────────────┘
```

**Related files:**
- `app/util/supabase/auth.ts:signInWithKakao()` - Initiates OAuth
- `app/api/auth/callback/route.ts` - Handles the callback
- `app/(pages)/(only-user)/layout.tsx` - Auth verification

## Data Flow (Client → Server → Supabase)

### Read

```
Component               Server Action              Supabase
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

**Example (jam session list):**
```typescript
// app/ui/templates/feed.tsx
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["data", filter],
  queryFn: ({ pageParam }) => fetchJams({ pageParam, queryFnParam: filter }),
  staleTime: 1000 * 60 * 5,  // 5-minute caching
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

### Create

```
Component               Server Action              Supabase
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

**Example (application):**
```typescript
// Called from the component
const result = await createJamEntry({
  jam_id,
  user_id,
  appeal: formData.appeal,
  applied_pos: selectedPosition,
});

// app/api/functions/create.ts
export async function createJamEntry(input: CreateJamEntryDto): Promise<boolean> {
  input.appeal = await sanitize(input.appeal);  // XSS prevention
  const supabase = await createClient();
  const { error } = await supabase.from("jamentry").insert(input);
  return !error;
}
```

## State Management (Zustand + React Query)

### Zustand Stores (client state)

```typescript
// app/stores/session.ts
interface SessionStore {
  userProfile: UserProfile;
  setUserProfile: (input: Partial<UserProfile>) => void;
  resetUserProfile: () => void;
  signupProfileImage: string | null;
  setSignupProfileImage: (image: string | null) => void;
  signupData: Partial<SignupFormData>;
  setSignupData: (data: Partial<SignupFormData>) => void;
}

// app/stores/bottom-sheet.ts
interface BottomSheetStore {
  children: ReactNode;
  location: BottomSheetHeight;
  header: boolean;
  set: (input: Partial<BottomSheetStore>) => void;
  close: () => void;
}

// app/stores/notification.ts
interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
}
```

**Usage:**
```typescript
import { useBottomSheetStore, useSessionStore } from '@/app/stores';

// Open the bottom sheet
const { set } = useBottomSheetStore();
set({
  children: <MyComponent />,
  location: BottomSheetHeight.Full,
});

// Update the user profile
const { setUserProfile } = useSessionStore();
setUserProfile({ nickname: "New nickname" });
```

### React Query (server state)

```typescript
// Infinite scroll feed
const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
  queryKey: ["jamsessions", filter],
  queryFn: ({ pageParam }) => fetchJams({ pageParam, filter }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
});

// Integrated with the Intersection Observer
useEffect(() => {
  if (inView && hasNextPage) fetchNextPage();
}, [inView, hasNextPage]);
```

## Routing Structure

### Route Groups

In the Next.js App Router, `(folderName)` is a group that is not included in the URL.

| Group | Purpose | Protection |
|------|------|------|
| `(pages)` | Common layout for all pages | - |
| `(only-user)` | Login-required pages | Auth verification |
| `(signin)` | Login/sign-up pages | Redirect if already logged in |

### URL Mapping

| File path | URL |
|----------|-----|
| `app/(pages)/(signin)/page.tsx` | `/` |
| `app/(pages)/(signin)/signup/page.tsx` | `/signup` |
| `app/(pages)/(only-user)/jamsession/page.tsx` | `/jamsession` |
| `app/(pages)/(only-user)/jamsession/post/[id]/page.tsx` | `/jamsession/post/123` |
| `app/(pages)/(only-user)/mypage/page.tsx` | `/mypage` |
| `app/(pages)/(only-user)/myact/page.tsx` | `/myact` |
| `app/(pages)/(only-user)/user-profile/[nickname]/page.tsx` | `/user-profile/john` |

### Layout Hierarchy

```
app/layout.tsx (Root: metadata, Analytics)
└── app/(pages)/layout.tsx (Global: Context, QueryClient)
    ├── app/(pages)/(signin)/layout.tsx (unauthenticated: login check)
    │   └── page.tsx (/)
    │   └── signup/page.tsx (/signup)
    │
    └── app/(pages)/(only-user)/layout.tsx (authenticated: session verification)
        └── jamsession/layout.tsx
            └── page.tsx (/jamsession)
            └── post/[id]/page.tsx (/jamsession/post/:id)
        └── mypage/page.tsx (/mypage)
        └── myact/page.tsx (/myact)
```

## Related Documents

- [Context](../context/README.md) - Project context
- [Patterns](../patterns/README.md) - Code patterns
- [Design](../design/README.md) - Design system guide
- [Reference](../reference/README.md) - API/schema reference
