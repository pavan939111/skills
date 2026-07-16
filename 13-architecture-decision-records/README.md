# 13 — Architecture Decision Records (ADRs)

Logs and documents critical architectural decisions, constraints, and operational choices made during development.

## Decision Records Catalog

*   **[ADR 0001: Standardized 14-Layer Information Architecture](0001-standardized-14-layer-information-architecture-record.md)** — Establishes the 14-layer separation rules and file name suffix guidelines.
*   **[ADR 0002: API Communication Strategy](0002-api-communication-strategy.md)** — Decision brief selecting REST for external clients and gRPC for internal microservice RPCs.
*   **[ADR 0003: Relational Database Selection](0003-relational-database-selection-record.md)** — Standardizes on PostgreSQL as the primary transactional storage engine.
*   **[ADR 0004: Transactional Outbox Pattern](0004-transactional-outbox-pattern.md)** — Selects outbox pattern to guarantee at-least-once distributed transaction publishing.
*   **[ADR 0005: Stateless JWT Authentication](0005-stateless-jwt-authentication-record.md)** — Establishes asymmetric token authentication with HTTP-only cookies.
