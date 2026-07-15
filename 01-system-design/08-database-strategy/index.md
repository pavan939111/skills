# 08 — Database Strategy

Decides storage direction — SQL vs NoSQL, one database or several, whether replication/sharding will eventually be needed. Comparison and decision only. Template: **B — Decision Brief** (see `../README.md`). Implementation detail → `../../database-design/01-database-selection/`, `../../database-design/06-scalability/`.

## Topics

| # | Topic | File | Status |
|---|-------|------|--------|
| 01 | SQL vs NoSQL | `sql-vs-nosql-strategy.md` | done |
| 02 | Database Selection | `database-selection-strategy.md` | done |
| 03 | Polyglot Persistence | `polyglot-persistence-strategy.md` | done |
| 04 | Replication Strategy | `replication-strategy.md` | done |
| 05 | Sharding Strategy | `sharding-strategy.md` | done |
| 06 | Partitioning | `partitioning-strategy.md` | done |
| 07 | Data Consistency | `data-consistency-strategy.md` | done |
| 08 | Database Decision Framework | `database-decision-framework-strategy.md` | done |

> This folder decides *whether* replication/sharding/a given database family is needed for this product. The *how* — actual sharding mechanics, index design, schema — lives entirely in `../../database-design/`.
