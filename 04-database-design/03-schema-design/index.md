# 03 — Schema Design

Turning the data model into an actual database structure: keys, constraints, indexes, and analytical schema patterns. Every file follows the 12-section research template.

> Note: `partitioning-schema-design.md` and `sharding-schema-design.md` also appear in `06-scalability/`. Here they cover the *schema-level structural mechanics* (how a partitioned/sharded table is defined); in `06-scalability/` they cover the *scaling strategy and operational trade-offs*. Cross-reference both.

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
| 01 | Primary Keys | `primary-keys-schema-design.md` | done |
| 02 | Foreign Keys | `foreign-keys-schema-design.md` | done |
| 03 | Composite Keys | `composite-keys-schema-design.md` | done |
| 04 | Surrogate Keys | `surrogate-keys-schema-design.md` | done |
| 05 | Constraints | `constraints-schema-design.md` | done |
| 06 | Indexes | `indexes-schema-design.md` | done |
| 07 | Star Schema | `star-schema-schema-design.md` | done |
| 08 | Snowflake Schema | `snowflake-schema-schema-design.md` | done |
| 09 | Slowly Changing Dimensions | `slowly-changing-dimensions-schema-design.md` | done |
| 10 | Partitioning | `partitioning-schema-design.md` | done |
| 11 | Sharding | `sharding-schema-design.md` | done |
