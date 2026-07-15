# 04 — Database Design

A database-architect-level knowledge base: everything needed to decide which database to use, how to design it, how to optimize it, how to secure it, and how to operate it in production. Scope is the data layer as its own discipline — **how application code talks to the database (ORM usage, repository pattern) lives in `../03-backend-development`, not here.**

Every topic lives in a named folder — one topic = one `.md` file, each following the 12-section research template (folder 12, Production Checklists, uses a lighter checklist-only format — see its own index). Once fully researched, this folder gets distilled into a reusable skill for AI coding agents.

**Status legend:** ✅ done · ⏳ pending

## Workflow — the order an AI agent should follow when designing a database for a new project

1. **Choose the correct database(s)** for the use case → `01-database-selection/`
2. **Design the domain model and relationships** → `02-data-modeling/`
3. **Create the schema** with keys, constraints, and indexes → `03-schema-design/`
4. **Apply database best practices** → `04-database-best-practices/`
5. **Optimize queries and indexing** → `05-query-and-performance/`
6. **Plan for scalability** → `06-scalability/`
7. **Secure the database** → `07-security/`
8. **Configure backup and disaster recovery** → `08-reliability-and-backup/`
9. **Apply data governance** (retention, quality, lineage — enterprise/compliance-driven projects) → `09-data-governance/`
10. **Apply AI/modern database patterns**, if the product needs vector search or RAG → `10-ai-and-modern-databases/`
11. **Plan migrations and schema evolution** → `11-migrations-and-versioning/`
12. **Validate using the production checklist** → `12-production-checklists/`
13. **Reach for a known design pattern** instead of improvising, when the use case matches one (multi-tenant SaaS, event sourcing, CQRS, audit logging) → `13-design-patterns/`

## Folder map

```
04-database-design/
├── README.md                          (this file)
│
├── 01-database-selection/             12 topics — which DB type fits the use case
├── 02-data-modeling/                   9 topics — entities, relationships, domain modeling
├── 03-schema-design/                  11 topics — keys, constraints, indexes, warehouse schemas
├── 04-database-best-practices/        10 topics — naming, transactions, consistency, anti-patterns
├── 05-query-and-performance/           9 topics — indexing strategy, query optimization
├── 06-scalability/                     9 topics — replication, sharding, CAP theorem
├── 07-data-access/               8 topics — Repository, Unit of Work, Pools, Migrations
├── 07-security/                       11 topics — access control, encryption, auditing, compliance
├── 08-reliability-and-backup/          8 topics — backups, DR, failover, HA, RTO/RPO
├── 09-data-governance/                 7 topics — retention, quality, lineage, lifecycle
├── 10-ai-and-modern-databases/         8 topics — vector search, embeddings, RAG storage
├── 11-migrations-and-versioning/       6 topics — safe schema evolution
├── 12-production-checklists/           7 topics — pre-deployment validation (checklist format)
└── 13-design-patterns/                 9 topics — multi-tenant, event sourcing, CQRS, outbox, etc.
```

**Total: 116 topics.**

## Research template (folders 01–11 and 13)

1. Definition & core concepts
2. Why it exists / what problem it solves
3. What breaks in production without it
4. Best practices
5. Common mistakes / anti-patterns
6. Security considerations
7. Performance considerations
8. Scalability considerations
9. How major companies implement it (real-world examples)
10. Decision checklist (when to use / when NOT to use)
11. AI coding-agent implementation guidelines (concrete, imperative rules)
12. Reusable checklist

Folder 12 (`production-checklists/`) uses a lighter format — see its own `index.md`.

---

## Folder reference

| Folder | Covers | Topics | Status |
|---|---|---|---|
| [`01-database-selection/`](./01-database-selection/index.md) | Relational, Document, Key-Value, Graph, Wide-Column, Time-Series, Search Engine, Vector, Decision Framework, SQL vs NoSQL, Polyglot Persistence, Hybrid Architecture | 12 | 12 ✅ / 12 ⏳ |
| [`02-data-modeling/`](./02-data-modeling/index.md) | Entity Identification, Relationship Modeling, Cardinality, Normalization, Denormalization, ER Diagrams, Domain Modeling, Aggregate Design, Naming Conventions | 9 | 9 ✅ / 9 ⏳ |
| [`03-schema-design/`](./03-schema-design/index.md) | Primary/Foreign/Composite/Surrogate Keys, Constraints, Indexes, Star/Snowflake Schema, SCD, Partitioning, Sharding | 11 | 11 ✅ / 11 ⏳ |
| [`04-database-best-practices/`](./04-database-best-practices/index.md) | Naming Standards, Schema Organization, Transaction Design, Data Consistency, Audit Columns, Soft Delete, Timestamps, Connection Pooling, Caching, Anti-Patterns | 10 | 10 ✅ / 10 ⏳ |
| [`05-query-and-performance/`](./05-query-and-performance/index.md) | Indexing Strategy, Query Optimization, Execution Plans, N+1, Pagination, Bulk Operations, Materialized Views, Read/Write Splitting, Performance Checklist | 9 | 9 ✅ / 9 ⏳ |
| [`06-scalability/`](./06-scalability/index.md) | Replication, Read Replicas, Horizontal/Vertical Scaling, Partitioning, Sharding, Distributed Databases, CAP Theorem, Eventual Consistency | 9 | 9 ✅ / 9 ⏳ |
| [`07-security/`](./07-security/index.md) | Authentication, Authorization, Row/Column-Level Security, Encryption at Rest/in Transit, Secrets Management, Auditing, PII Protection, SQL Injection, Compliance | 11 | 11 ✅ / 11 ⏳ |
| [`08-reliability-and-backup/`](./08-reliability-and-backup/index.md) | Backup Strategies, Restore Testing, Disaster Recovery, Failover, High Availability, RTO/RPO, Monitoring, Health Checks | 8 | 8 ✅ / 8 ⏳ |
| [`09-data-governance/`](./09-data-governance/index.md) | Data Retention, Archiving, Data Quality, Data Lineage, Metadata, Master Data, Lifecycle Management | 7 | 7 ✅ / 7 ⏳ |
| [`10-ai-and-modern-databases/`](./10-ai-and-modern-databases/index.md) | Vector Database Design, Embedding Storage, Hybrid Search, Metadata Filtering, Chunking, Reranking, RAG Storage, Multi-Database Patterns | 8 | 8 ✅ / 8 ⏳ |
| [`11-migrations-and-versioning/`](./11-migrations-and-versioning/index.md) | Migration Strategy, Zero-Downtime Migrations, Rollback Strategy, Schema Versioning, Data Migration, Compatibility | 6 | 6 ✅ / 6 ⏳ |
| [`12-production-checklists/`](./12-production-checklists/index.md) | Schema/Performance/Security/Scalability/Backup/Migration Review, Production Readiness | 7 | 7 ✅ / 7 ⏳ |
| [`13-design-patterns/`](./13-design-patterns/index.md) | Multi-Tenant Database, Event Sourcing Storage, CQRS Database, Audit Log, Outbox, Soft Delete, Temporal Tables, Read Model, Polyglot Persistence Pattern | 9 | 9 ✅ / 9 ⏳ |

---

## Overall progress

**116 of 116 topics done.**
