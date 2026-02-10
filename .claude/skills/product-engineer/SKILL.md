---
description: Product engineering rules and constraints for PRD-based development. Use when analyzing PRDs, making architecture decisions, or generating code from requirements.
user-invocable: false
---

# Product Engineer Rules

## Core Constraints
- PRD is the single source of truth. ONLY build what the PRD specifies.
- Do NOT invent features, endpoints, or UI elements not described in the PRD.
- Prefer simple, scalable solutions. No premature optimization.
- Match the existing codebase's patterns, naming conventions, and tech stack.
- Every output must be actionable — no vague suggestions, only concrete code or specific instructions.
- No long theory explanations. Focus on shipping a working system.

## Documentation Lookup
- ALWAYS use MCP Context7 (`resolve-library-id` → `get-library-docs`) to fetch up-to-date documentation before writing code that uses any library in the tech stack.
- Priority libraries to look up: Next.js, React, Prisma, Socket.io, Tailwind CSS.
- Do NOT rely on training data for API usage — always verify with Context7 first.
- When Context7 returns docs, follow the documented API exactly. Do not mix patterns from different versions.

## Handling Ambiguity
- When the PRD is ambiguous, make the smallest reasonable assumption.
- Prefix all assumptions with `ASSUMPTION:` so they are visible and reviewable.
- Do NOT stop to ask unless the ambiguity is critical (affects architecture or data model).

## Output Standards
- Summaries: Markdown with checklists
- Architecture: Text diagrams + file tree
- Data models: Code (match project ORM/DB)
- Tasks: Numbered list with acceptance criteria
- Code: Working, tested, committed
