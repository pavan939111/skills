# 23 — Backend Checklists

Recurring checklists used *throughout* development — e.g. run on every PR or every new endpoint — as opposed to `..21-readiness-audit/`, which is the one-time gate run right before shipping. Format: **Checklist**.

## Topics

| # | Topic | File | Status |
|---|-------|------|--------|
| 01 | Backend Implementation | `backend-implementation.md` | ⏳ pending |
| 02 | Code Review | `code-review-checklist.md` | ⏳ pending |
| 03 | API Review | `api-review-checklist.md` | ⏳ pending |
| 04 | Security Review | `security-review-checklist.md` | ⏳ pending |
| 05 | Testing Review | `testing-review-checklist.md` | ⏳ pending |
| 06 | Deployment Review | `deployment-review-checklist.md` | ⏳ pending |
| 07 | Production-Ready | `production-ready-checklist.md` | ⏳ pending |

> Note: `api-review-checklist.md` and `security-review-checklist.md` also appear in `..21-readiness-audit/`. Here they're a short per-PR checklist ("did this specific endpoint follow the rules"); there they're a whole-service final audit ("does the entire service pass"). Different scope, same name — not a duplicate.

> [!NOTE]
> These check lists represent recurring, per-change reviews (PR checklists, code diff audits) executed continuously during development cycles — distinct from the one-time, phase-gate architecture checks mapped in `../01-readiness-audit/`.