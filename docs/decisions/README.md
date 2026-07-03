# Decisions (ADR)

> Architecture Decision Records - Documenting key technical decisions and their rationale

## What is an ADR?

An ADR (Architecture Decision Record) documents the important technical decisions made in a project along with their background. It helps AI understand "why something was implemented this way."

## ADR Writing Guide

### When to write one?

- Introducing a new tech stack
- Choosing an architecture pattern
- Selecting a library (among several alternatives)
- Important performance/security decisions
- Decisions that change an existing approach

### Writing Principles

1. **Be concise**: Record only the essentials
2. **Include context**: Explain the situation at the time of the decision
3. **Record alternatives**: The other options that were considered
4. **Record consequences**: The impact resulting from the decision

---

## ADR Template

```markdown
# ADR-XXX: [Decision Title]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Date

YYYY-MM-DD

## Context

[The background and situation that required the decision]

## Options Considered

### Option 1: [Name]
- Pros: ...
- Cons: ...

### Option 2: [Name]
- Pros: ...
- Cons: ...

## Decision

[The chosen option and the reason]

## Consequences

[The impact and trade-offs resulting from the decision]
```

---

## List of Recorded Decisions

### ADR-001: Mobile Web-Only Design

**Status:** Accepted
**Date:** Project start

**Context:**
- Musicians' usage pattern of quickly checking/applying to jam sessions while out and about
- Lack of resources for native app development

**Options Considered:**
1. Responsive web (desktop + mobile)
2. Mobile-only web
3. Native app (React Native)

**Decision:** Chose mobile-only web
- Fixed viewport (`min-width: 375px`, `max-width: 600px`)
- Touch-optimized UI (Bottom Sheet, swipe)

**Consequences:**
- Fast development speed
- Significant resources invested in resolving iOS Safari compatibility issues
- Limited desktop user experience

---

### ADR-002: Choosing Supabase

**Status:** Accepted
**Date:** Project start

**Context:**
- Need for a full-stack solution (Auth, DB, Storage)
- Need for fast MVP development
- Solo development environment

**Options Considered:**
1. Supabase (PostgreSQL + Auth + Storage)
2. Firebase (NoSQL + Auth + Storage)
3. Build from scratch (Express + PostgreSQL + S3)

**Decision:** Chose Supabase
- SQL-based support for complex queries
- Security handled via Row Level Security
- Built-in real-time features

**Consequences:**
- Fast development speed
- Convenient relational queries
- Some advanced features are limited

---

### ADR-003: Server State Management with React Query

**Status:** Accepted
**Date:** Early development

**Context:**
- Need to implement an infinite scroll feed
- Need for caching and refetching logic
- Loading/error state management

**Options Considered:**
1. React Query (TanStack Query)
2. SWR
3. Redux + RTK Query
4. Custom implementation (useState + useEffect)

**Decision:** Chose React Query
- Easy infinite scroll implementation with `useInfiniteQuery`
- Automatic caching and background refetching
- Compatible with the Next.js App Router

**Consequences:**
- Simplified server state management code
- Reduced unnecessary requests with 5-minute caching
- Increased bundle size

---

### ADR-004: Using Server Actions

**Status:** Accepted
**Date:** When Next.js 16 was adopted

**Context:**
- Stabilization of Server Actions in Next.js 16
- Need to choose between API Route vs Server Action

**Options Considered:**
1. API Routes (existing approach)
2. Server Actions (new approach)
3. Mixed use

**Decision:** Primarily use Server Actions, keep API Routes for external API proxying
- CRUD operations: Server Actions (`app/api/functions/`)
- External API proxying: API Routes (`app/api/maniadb/`, `app/api/naver/`)

**Consequences:**
- Improved type safety
- Simplified client code
- Somewhat harder to debug

---

### ADR-005: Handling iOS Safari

**Status:** Accepted
**Date:** Continuously updated

**Context:**
- Various layout issues occur in iOS Safari
- Address bar height changes, auto-zoom, scroll problems

**Solutions Applied:**
1. Prevent auto-zoom with the `maximum-scale=1` meta tag
2. Calculate dynamic viewport height with the `--vh` CSS variable
3. Hide the scrollbar with the `overflow-without-scroll` class
4. Control scrolling when input fields are focused

**Consequences:**
- More than 18 debugging attempts
- Currently provides a stable mobile experience
- Increased code complexity

---

## Decisions Still to Be Made

- [ ] Real-time notification implementation approach (Supabase Realtime vs FCM)
- [ ] Image optimization approach (Vercel Image vs Supabase Transform)
- [ ] Testing strategy (E2E vs Unit)

---

## Related Documents

- [Context](../context/README.md) - Project context
- [Architecture](../architecture/README.md) - System structure
- [Patterns](../patterns/README.md) - Code patterns
