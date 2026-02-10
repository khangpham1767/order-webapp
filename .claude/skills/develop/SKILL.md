---
name: develop
description: Turn a PRD into a working order management application. 6-phase workflow from comprehension to validation.
disable-model-invocation: true
argument-hint: [instruction]
---

# /develop — PRD to Implementation

## Tech Stack (Mandatory)

All code MUST use this stack. Do NOT propose alternatives:

- **Frontend**: React 19.2 + Next.js 16 (App Router, Turbopack default)
- **Language**: TypeScript 5.1+
- **Styling**: Tailwind CSS
- **Realtime**: Socket.io (custom server in `server/`)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Node.js**: 20.9+ (required by Next.js 16)

### Next.js 16 Key Rules
- `proxy.ts` replaces `middleware.ts` (runs on Node.js, NOT edge)
- All `params`, `searchParams`, `cookies()`, `headers()` are **async** — always `await`
- Turbopack is default bundler (no `--turbopack` flag needed)
- `cacheComponents: true` replaces `experimental.ppr` and `experimental.dynamicIO`
- React Compiler: `reactCompiler: true` (stable, not experimental)
- Turbopack config at top-level `turbopack: {}` (not `experimental.turbopack`)
- Parallel routes require explicit `default.tsx` for all slots
- Use `images.remotePatterns` (not `images.domains`)
- Use environment variables (not `serverRuntimeConfig`/`publicRuntimeConfig`)
- Use `cacheLife`, `cacheTag` (no `unstable_` prefix)

### React 19 Key Rules
- React Compiler handles memoization — avoid manual `useMemo`/`useCallback`
- Use `use` API for reading promises/context in render
- Use Actions API (async transitions) for pending states, errors, forms
- Server Components by default; add `"use client"` only when needed
- `useEffectEvent` for non-reactive logic in Effects
- View Transitions available for navigation animations

---

Execute the following phases in order. Complete each phase fully before moving to the next.

## Phase 1: PRD Comprehension
- Read the PRD as the single source of truth
- Extract:
  - Roles (staff, kitchen, cashier, admin...)
  - States and state transitions
  - Queue rules
  - Realtime constraints
- List all features as a flat checklist
- List all screens/pages needed
- If ambiguity exists: make the smallest reasonable assumption, prefix with `ASSUMPTION:`, continue

**Output:** Structured summary for user to confirm before proceeding

## Phase 2: System Design
- Define overall architecture
- Define realtime flow (Order ↔ Kitchen)
- Define queue handling rules
- Define data ownership boundaries
- Propose folder structure and module boundaries

**Output:** Concise system design doc with text diagram

## Phase 3: Data Modeling
- Define entities and relationships:
  - Order
  - OrderItem
  - OrderBatch
  - KitchenQueue
  - Payment
  - AccountingSnapshot
- Include status enums and state transitions
- Include indexes and constraints
- Mark required vs optional fields

**Output:** Schema definition (match project ORM/DB)

## Phase 4: Implementation Plan
- Break into implementable tasks (each = 1 PR-sized unit)
- Prioritize:
  1. Core order flow
  2. Kitchen realtime queue
  3. Order editing rules
  4. Payment
  5. Accounting
- Each task must be implementable independently
- Each task includes: what to build, files to create/modify, acceptance criteria from PRD

**Output:** Numbered task list

## Phase 5: Code Generation
- Execute tasks in order
- After each task: verify it works before moving to next
- Clearly label: Frontend / Backend / Realtime (Socket/Pusher)
- Write tests for critical paths (business logic, state transitions)
- Keep code readable and production-oriented
- Commit after each completed task

**Output:** Working, tested code

## Phase 6: Validation
- Verify implementation against PRD checklist from Phase 1
- Check specifically:
  - Queue correctness
  - Edit / cancel rules
  - Cooking state lock
  - Append-to-front logic
- Explicitly list what is covered and what is pending

**Output:** Coverage report (covered vs pending)

## Response Format (every response)
1. **Phase:** [current phase name]
2. **Output:** [phase deliverable]
3. **Next:** [what happens next]

## Stop Condition
When a phase is completed: summarize, then wait for next user instruction.

$ARGUMENTS
