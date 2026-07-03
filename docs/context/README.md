# Context

> The first document AI should read when encountering the project for the first time

## Project Overview

**JAMMING** - An ensemble/jam session matching mobile web platform for musicians

A service that simplifies the process of finding partners to play with, hosting jam sessions, or joining them.

| Item        | Details                                    |
| ----------- | ------------------------------------------ |
| Service URL | https://jamming.co.kr                      |
| Platform    | Mobile web (PWA)                           |
| Main target | Amateur/hobbyist musicians in Korea        |

## Core Goals and Values

1. **Simplified matching**: Enable musicians to meet easily based on region
2. **Respect for diversity**: Anyone can participate regardless of genre or skill level
3. **Mobile optimization**: Quickly check/apply for sessions anytime, anywhere

## Business Domain

### JamSession (Jam Session)

An ensemble gathering hosted by a host.

```typescript
// Core fields
{
  title: string;              // Session title (5-20 chars)
  body: string;               // Detailed description (max 1000 chars)
  datetime: string;           // Date and time
  location: LocationEnum[];   // Region (multiple selection)
  location_detail: {          // Exact venue
    name: string;
    address: string;
  };
  genre: GenreEnum[];         // Genre (multiple selection)
  level: LevelEnum[];         // Skill level (multiple selection)
  headcnt_by_pos: Array<{     // Headcount by position
    pos: PositionEnum;
    headcnt: number;
  }>;
  songs: Array<{              // List of songs to play
    title: string;
    artist: string;
  }>;
}
```

### JamEntry (Application)

A user's application to join a jam session.

```typescript
{
  jam_id: number; // Session to apply for
  user_id: string; // Applicant
  appeal: string; // Self-introduction
  applied_pos: PositionEnum; // Position applied for
  is_allowed: boolean; // Host approval status
  is_rejam: boolean; // Rejam (re-application) status
}
```

**Flow:**

1. User applies from the session detail page
2. Host reviews the application list and approves/rejects
3. Only approved users are confirmed to participate

### User

```typescript
{
  nickname: string;           // Nickname (1-8 chars, English/Korean/numbers)
  profile_image: string;      // Profile image URL
  pos: PositionEnum;          // Main position
  genre: GenreEnum;           // Preferred genre
  level: LevelEnum;           // Skill level
  location: LocationEnum;     // Active region
  tags: string[];             // Tags (#rock, #blues, etc.)
  bpm: number;                // BPM (optional)
}
```

### Enum Classification System

**Genre (GenreEnum)**

- General, Rock, Pop, Indie, Jazz, Funk, Metal

**Position (PositionEnum)**

- Guitar, Bass, Drums, Vocals, Keyboard, Other

**Level (LevelEnum)**

- Pro, Amateur, Study, Hobby

**Region (LocationEnum)**

- All, Seoul, Northern Gyeonggi, Southern Gyeonggi, Incheon, Busan, Daegu, Daejeon, Gwangju, Ulsan, Sejong, Gangwon, North Chungcheong, South Chungcheong, North Jeolla, South Jeolla, North Gyeongsang, South Gyeongsang, Jeju (19 total)

## Technical Constraints

### Mobile First

- **Viewport constraints**: `min-width: 375px`, `max-width: 600px`
- **Touch optimization**: Bottom Sheet, swipe gesture support
- **Not responsive**: Mobile-only layout

### iOS Safari Compatibility

The area where the most debugging resources were invested in the project.

- **Prevent auto-zoom**: `maximum-scale=1` setting
- **Address bar height handling**: Dynamic calculation via the `--vh` CSS variable
- **Scroll behavior optimization**: `overflow-without-scroll` class
- **Controlling screen movement during keyboard input**

### Tech Stack Constraints

| Item      | Version/Tech | Notes                       |
| --------- | ------------ | --------------------------- |
| Framework | Next.js 16   | Uses App Router             |
| React     | 19 RC        | RC version                  |
| Tailwind  | 4            | Latest version              |
| Backend   | Supabase     | Integrated Auth, DB, Storage |
| Deployment | Vercel      | Analytics enabled           |

### External API Dependencies

- **ManiaDB**: Song search (Korean music DB)
- **Naver Map**: Venue search (Local Search API)
- **Kakao**: OAuth login

## Related Documents

- [Architecture](../architecture/README.md) - System structure
- [Patterns](../patterns/README.md) - Code patterns
- [Design](../design/README.md) - Design system guide
- [Reference](../reference/README.md) - API/schema reference
