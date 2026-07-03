# Tasks

> Tracks current in-progress work and the backlog so the AI can support continuous work

## Task Tracking Guide

### Purpose of This Document

Helps the AI quickly grasp the project's current context to:
- Continue previous work
- Write code that accounts for relevant context
- Suggest tasks aligned with priority

### Task Status

| Status | Description |
|------|------|
| `In progress` | Item currently being worked on |
| `Waiting` | Item to handle next |
| `Needs review` | Completed but requires confirmation |
| `Done` | Fully finished item |
| `On hold` | Temporarily suspended item |

---

## Current In-Progress Work

> Update this section when work starts/completes

### [No tasks]

There are no tasks currently in progress.

<!--
### Example: Implementing a New Feature

**Status:** In progress
**Start date:** YYYY-MM-DD
**Related files:**
- `app/(pages)/(only-user)/jamsession/...`

**Description:**
Description of the task

**Progress:**
- [x] Completed step
- [ ] In-progress step
- [ ] Planned step

**Notes:**
Additional information the AI should know
-->

---

## Backlog

> Sorted by priority

### High Priority

| Task | Description | Related Files |
|------|------|----------|
| - | - | - |

### Medium Priority

| Task | Description | Related Files |
|------|------|----------|
| Real-time session viewer display | Use Supabase Realtime Presence to show "who is viewing the session right now" in real time. Session detail page (viewer count), home screen (active stats by region), feed card badge (optional). Detailed plan: `/Users/coolguy/.claude/plans/tranquil-juggling-spark.md` | `app/hooks/usePresence.ts`, `app/hooks/useSessionViewers.ts`, `app/hooks/useRegionPresence.ts`, `app/ui/components/viewer-count.tsx`, `app/ui/components/region-activity.tsx`, `app/(pages)/(only-user)/jamsession/post/[id]/page.tsx`, `app/(pages)/page.tsx` |

### Low Priority

| Task | Description | Related Files |
|------|------|----------|
| - | - | - |

---

## Recently Completed Work

> Keep the most recent 5 items

| Task | Completion Date | Related Commit |
|------|--------|----------|
| Create project documentation structure | 2026-01-31 | - |
| Vercel 15–16 vulnerability hotfix | - | `6c338ab` |
| Send feedback, enable SEO | - | `5b1966c` |
| Prevent iOS Safari auto-zoom | - | `007b15a` |

---

## Known Issues

> Items that need fixing but are not yet in the backlog

| Issue | Severity | Description |
|------|--------|------|
| - | - | - |

---

## Technical Debt

> Areas that need refactoring

| Area | Current State | Improvement Direction |
|------|----------|----------|
| iOS Safari support | Numerous hotfixes applied | Build a systematic mobile compatibility layer |

---

## Related Documents

- [Context](../context/README.md) - Project context
- [Decisions](../decisions/README.md) - Technical decision records
