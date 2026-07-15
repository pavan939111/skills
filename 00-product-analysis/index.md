# 00 — Product Analysis

The first layer an AI agent (or engineer) works through on any new project — before system design, before any architecture or technology decision. Answers "what are we building, for whom, and why" so every downstream decision (system design, backend, database) is grounded in real requirements instead of default habits or arbitrary preference.

**Status legend:** ✅ done · ⏳ pending

## Workflow position

```
Product Analysis  ← you are here
      ↓
System Design           (01-system-design/)
      ↓
Backend Architecture     (backend-development/)
      ↓
Database Design           (database-design/)
      ↓
Infrastructure / Production   (production_principles/)
      ↓
Implementation
```

## Research template (every file follows this structure)

1. Definition & core concepts
2. Why it exists / what problem it solves
3. What goes wrong on a project without it
4. Best practices
5. Common mistakes / anti-patterns
6. How it constrains/informs downstream decisions (system design, backend, database)
7. What "good" looks like — quality bar for this artifact
8. How major companies/teams do it
9. Decision checklist (when to go deep vs. keep it lightweight)
10. AI coding-agent implementation guidelines (what questions to ask the user, what to produce)
11. Reusable checklist
12. Output template (a fill-in-the-blank artifact this step should produce)

## Topics

| # | Topic | File | Status |
|---|-------|------|--------|
| 01 | Business Requirements | `business-requirements-analysis.md` | done |
| 02 | User Personas | `user-personas-analysis.md` | done |
| 03 | User Flows | `user-flows-analysis.md` | done |
| 04 | Functional Requirements | `functional-requirements-analysis.md` | done |
| 05 | Non-Functional Requirements | `non-functional-requirements-analysis.md` | done |
| 06 | Constraints | `constraints-analysis.md` | done |
| 07 | AI Feasibility | `ai-feasibility-analysis.md` | done |
| 08 | Project Scope | `project-scope-analysis.md` | done |
| 09 | Success Metrics | `success-metrics-analysis.md` | done |

> Note: `functional-requirements-analysis.md` and `non-functional-requirements-analysis.md` also appear in `01-system-design/`. Here they capture requirements in product/business language (what the user needs, in plain terms); in `01-system-design/` they're translated into technical/architectural terms (throughput numbers, latency budgets, consistency requirements). Cross-reference both.

## Overall progress

**9 of 9 topics done.**
