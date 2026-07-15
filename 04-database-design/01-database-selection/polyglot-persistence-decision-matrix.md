# Polyglot Persistence

## 1. Definition & Core Concepts

Polyglot Persistence is the architectural design pattern of using multiple, distinct database technologies (e.g., Relational, Document, Key-Value, Graph, Search Index) within a single application system to handle different data storage and querying requirements.

Core pieces:
- **Database-per-Service:** Associating distinct database engines with specific microservices, ensuring services only access their own data stores.
- **Transactional Outbox Pattern:** A pattern where state changes and synchronization events are written to a single database transaction, ensuring consistent updates across different stores.
- **Change Data Capture (CDC):** Monitoring primary database logs (e.g., Postgres WAL) and automatically shipping mutations to secondary databases (e.g. Elasticsearch) asynchronously.
- **Eventual Consistency Sync:** The sync pipeline that keeps secondary databases aligned with the primary write-authoritative database.

*(Boundary Note: Microservice network configurations, application-level transaction coordination code, and API gateway routing logic belong in `backend-development/`. This document covers polyglot database selection criteria, storage synchronization strategies, and data consistency boundaries.)*

## 2. Why It Exists / What Problem It Solves

No single database type can optimize for all access patterns. A database optimized for ACID transactions (RDBMS) is slow at full-text search; a database optimized for full-text search (Elasticsearch) is not transactional or reliable for primary balance ledgers. Polyglot persistence maps data concerns to the database engines specifically designed for them, optimizing system performance, scaling limits, and resource costs.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Divergent Secondary Stores (Desynchronization):** A user is deleted from the primary SQL database. The application code attempts to delete them from Elasticsearch, but the network drops. The user is deleted in SQL but still appears in search results, creating data inconsistencies.
- **Double-Write Failures:** Application code attempts to write to the primary database and a cache database sequentially (`db.save()`, `cache.set()`). The application crashes after the DB write but before the cache write, leaving the cache permanently out of sync.
- **Corrupted Backups & Disastrous Restores:** Backups of different database engines are taken at different times. After a restore, the SQL database references transaction IDs that do not exist in the secondary document store backups, corrupting system state.
- **Operational Complexity Overhead:** A small development team deploys 5 different database types for a simple CRUD application, exhausting their engineering capacity on cluster maintenance, patching, and monitoring.

## 4. Best Practices

- **Establish a Single Authoritative Source of Truth:** Choose one primary database (typically a relational SQL database) to act as the write-authoritative source of truth for core business state.
- **Sync Asynchronously via CDC or Outbox:** Never perform synchronous double-writes to multiple databases inside application code. Write state changes to the primary database, and use Change Data Capture (CDC) tools (like Debezium) or Outbox workers to update secondary stores (Elasticsearch, Redis) asynchronously.
- **Enforce Database Ownership Boundaries:** Do not share database instances across different microservices. Ensure each service accesses its database exclusively via its private API.
- **Keep Polyglot Architectures Lean:** Only introduce a new database technology when the existing database cannot satisfy the requirement (e.g. adding Elasticsearch only when SQL cannot handle autocomplete search latency).
- **Coordinate Backup Schedules:** Take consistent database snapshots or align backup retention times across all polyglot databases to ensure cohesive restore points.

## 5. Common Mistakes / Anti-Patterns

- **Synchronous Double-Writing:** Writing code like `await sql.save(); await redis.set(); await elastic.index();` in single transactional flows, which inevitably leaves databases out of sync.
- **The "Shared Database" Integration:** Connecting multiple microservices to the same physical database instances, bypassing service boundaries and locking schemas.
- **Joining Data Across Engines in App Code:** Fetching arrays of IDs from a SQL database and then querying a document database in a loop to combine records, generating massive network latency.
- **Premature Polyglotting:** Deploying multiple databases for small applications where a single PostgreSQL database (using extensions like pgvector or JSONB columns) could handle caching, JSON, and vector search.

## 6. Security Considerations

- **Credential Scoping and Rotation:** Maintain distinct, isolated credentials for each database engine. Do not reuse database passwords.
- **PII Distribution Control:** Track where user PII is duplicated across polyglot stores (e.g. SQL and Elasticsearch). Ensure GDPR deletion requests purge PII from all secondary stores, not just the primary SQL database.

## 7. Performance Considerations

- **Eventual Consistency Latency:** Design client applications to accept replica lag. If a user inserts a record, the follow-up read should query the primary database, as the secondary search index may take a few milliseconds to sync.

## 8. Scalability Considerations

- **Independent Scaling:** Polyglot persistence allows scaling databases independently. Scale up expensive memory-based caches (Redis) without needing to scale out larger relational database disks.

## 9. How Major Companies Implement It

- **Amazon:** Employs a database-per-service pattern. Shopping carts are stored in DynamoDB (AP document store for uptime), billing ledgers are stored in ACID Relational clusters, and product catalog searches route through dedicated search index nodes.
- **Uber:** Relies on relational databases for trip booking ledger transactions, but streams real-time vehicle GPS coordinates to Cassandra instances to support high-write location tracking.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Polyglot Persistence** when:
  - Different features of the application have fundamentally distinct data structures and latency needs (e.g., payment transactions vs full-text search).
  - Single database engines are hitting scaling limits under specialized workloads.
  - The engineering team has the capacity to monitor, backup, and operate multiple database types.
- Use **Single Database Architecture** when:
  - Building a monolith, MVP, or simple CRUD application with low traffic.
  - PostgreSQL extensions (JSONB, pgvector, full-text search) can satisfy secondary requirements without deploying new clusters.
  - Operational simplicity is the primary constraint.

## 11. AI Coding-Agent Implementation Guidelines

- Never write synchronous, multi-database write statements inside application controller routes.
- Always use the Transactional Outbox pattern or event publishers to synchronize data updates to secondary databases.
- Never allow different services to read or write directly to the same database tables.
- Always design client-side reads to handle eventual consistency latency between primary and secondary stores.
- Never recommend adding a new database engine if the existing primary database can handle the requirement using native extensions (e.g. pgvector).

## 12. Reusable Checklist

- [ ] Write-authoritative single source of truth database identified
- [ ] No synchronous double-writes written in application transaction code
- [ ] Data synchronization to secondary stores (caches, search indexes) executes asynchronously (CDC/Outbox)
- [ ] Each microservice has an isolated database (no shared databases across services)
- [ ] Eventual consistency latency accounted for in client read paths
- [ ] Backup schedules aligned across all polyglot database engines
- [ ] Separate, unique credentials configured for each database type
- [ ] GDPR data deletion paths purge PII from all polyglot databases (SQL, Search, Caches)
