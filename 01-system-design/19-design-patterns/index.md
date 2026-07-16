# 19 — Design Patterns

Architecture-level patterns — when a product's shape matches a known pattern, reach for it instead of improvising. Template: **B — Decision Brief** (see `../README.md`): each file explains when to choose the pattern at the architecture level and links out for implementation.

Implementation detail → `../../04-database-design/13-design-patterns/` (data-layer angle: how the pattern affects schema/storage) and `../../03-backend-development/` pattern folder, once built (code-layer angle: how to implement it in service code).

## Topics

| # | Topic | File | Status |
|---|-------|------|--------|
| 01 | CQRS | `cqrs-strategy.md` | done |
| 02 | Event Sourcing | `event-sourcing-strategy.md` | done |
| 03 | Saga | `saga-strategy.md` | done |
| 04 | Outbox | `outbox-strategy.md` | done |
| 05 | Backend-for-Frontend (BFF) | `bff-strategy.md` | done |
| 06 | Strangler Fig | `strangler-fig-strategy.md` | done |
| 07 | API Gateway | `api-gateway-strategy.md` | done |
| 08 | Sidecar | `sidecar-strategy.md` | done |
| 09 | Aggregator | `aggregator-strategy.md` | done |
| 10 | Choreography vs Orchestration | `choreography-vs-orchestration-strategy.md` | done |

> `cqrs-strategy.md`, `event-sourcing-strategy.md`, `saga-strategy.md`, and `outbox-strategy.md` here are ~half the length of their `database-design/13-design-patterns/` counterparts — architecture-level "does this product's shape call for this pattern," not the data-layer mechanics.
