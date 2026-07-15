# 06 — Scalability

Scaling a database as data volume and traffic grow: replication, partitioning/sharding as a *scaling strategy*, and the distributed-systems theory that governs trade-offs at scale. Every file follows the 12-section research template.

> Note: `partitioning-strategy.md` and `sharding-strategy.md` also appear in `03-schema-design/`. Here they cover the *scaling strategy and operational trade-offs* (when to shard, rebalancing, routing); in `03-schema-design/` they cover the *structural mechanics* of defining one. Cross-reference both.

## Research template (every file follows this structure)

1. Definition & core concepts
2. Why it exists / what problem it solves
3. What breaks in production without it
4. Best practices
5. Common mistakes / anti-patterns
6. Security considerations
7. Performance considerations
8. Scalability considerations
9. How major companies implement it
10. Decision checklist (when to use / when to skip)
11. AI coding-agent implementation guidelines
12. Reusable checklist

## Topics

| # | Topic | File | Status |
|---|-------|------|--------|
| 01 | Replication | `replication-strategy.md` | done |
| 02 | Read Replicas | `read-replicas-strategy.md` | done |
| 03 | Horizontal Scaling | `horizontal-scaling-strategy.md` | done |
| 04 | Vertical Scaling | `vertical-scaling-strategy.md` | done |
| 05 | Partitioning | `partitioning-strategy.md` | done |
| 06 | Sharding | `sharding-strategy.md` | done |
| 07 | Distributed Databases | `distributed-databases-strategy.md` | done |
| 08 | CAP Theorem | `cap-theorem-strategy.md` | done |
| 09 | Eventual Consistency | `eventual-consistency-strategy.md` | done |
